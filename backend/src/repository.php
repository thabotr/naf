<?php
namespace repository\database {
  use mysqli;
  use mysqli_stmt;

  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

  class DBRepository extends mysqli
  {
    protected static function getResultArray(mysqli_stmt $statement): array
    {
      $statement->execute();
      $result = $statement->get_result();
      $rows = $result->fetch_all(MYSQLI_ASSOC);
      return $rows;
    }
    function get_user_id_and_profile(string $handle, string $token): array
    {
      $stmt = $this->prepare("SELECT id FROM user WHERE handle=? AND token=?");
      $stmt->bind_param("ss", $handle, $token);
      $rows = DBRepository::getResultArray($stmt);
      if (count($rows) !== 1) {
        header('HTTP/1.0 401 Unauthorized');
        exit;
      }
      return [$rows[0]['id'], array("handle" => $handle)];
    }
    function get_user_chats(int $user_id): array
    {
      $stmt = <<<'SQL'
      WITH friend
        AS (
          SELECT user_a as id FROM connection WHERE user_b = ?
          UNION
          SELECT user_b as id FROM connection WHERE user_a = ?
        )
      SELECT user.handle FROM user
      INNER JOIN friend
      ON friend.id = user.id
      SQL;

      $prepared_stmt = $this->prepare($stmt);
      $prepared_stmt->bind_param("ii", $user_id, $user_id);
      $row_per_chat = DBRepository::getResultArray($prepared_stmt);
      $chats = array_map(
        function ($row) {
          return array("user" => array("handle" => $row['handle']));
        }
        ,
        $row_per_chat
      );
      return $chats;
    }
    function delete_user_chat(int $user_id, string $chat_handle): void
    {
      $stmt = <<<'SQL'
      DELETE FROM connection
      WHERE connection.user_a = ? AND connection.user_b IN (SELECT id FROM user WHERE handle = ?)
      OR
      connection.user_b = ? AND connection.user_a IN (SELECT id FROM user WHERE handle = ?)
      SQL;
      $prepared_stmt = $this->prepare($stmt);
      $prepared_stmt->bind_param("isis", $user_id, $chat_handle, $user_id, $chat_handle);
      $prepared_stmt->execute();
    }
    function add_user_message(int $user_id, array $message): array
    {
      $this->begin_transaction();

      $set_friend_id_variable = "SELECT @friend_id:=(SELECT id FROM user WHERE handle = ?)";
      $stmt = $this->prepare($set_friend_id_variable);
      $recipient_handle = $message['toHandle'];
      $stmt->bind_param("s", $recipient_handle);
      $stmt->execute();
      $stmt->free_result();

      $assert_is_our_friend = "
      SELECT * FROM connection
      WHERE user_a = @friend_id AND user_b = ?
      OR user_b = @friend_id AND user_a = ?";
      $stmt = $this->prepare($assert_is_our_friend);
      $stmt->bind_param("ii", $user_id, $user_id);
      $stmt->execute();
      $res = $stmt->get_result();
      if( $res->fetch_array() == NULL) {
        $this->rollback();
        return array();
      }

      $set_msg_created_at_variable = "SELECT @created_at:=(SELECT CURRENT_TIMESTAMP())";
      $this->query($set_msg_created_at_variable);

      $add_new_message_statement = "INSERT INTO message( text, from_user, to_user, created_at) ";
      $add_new_message_statement .= "VALUES ( ?, ?, @friend_id, @created_at)";
      $stmt = $this->prepare($add_new_message_statement);
      $message_text = $message['text'];
      $stmt->bind_param("si", $message_text, $user_id);
      $stmt->execute();
      $stmt->free_result();

      $get_msg_created_at = "SELECT @created_at AS created_at";
      $stmt = $this->query($get_msg_created_at);
      $res = $stmt->fetch_assoc();
      $this->commit();

      return array(
        "timestamp" => $res['created_at'],
      );
    }
  }
}
?>