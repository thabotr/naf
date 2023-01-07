<?php
use PHPUnit\Framework\Error\Error;

require_once(realpath(dirname(__FILE__) . '/src/repository.php'));
require_once(realpath(dirname(__FILE__) . '/src/router.php'));

use repository\database\DBRepository;
use resource\Router;

Router::get("/ping", function () {
  echo "pong";
  exit;
});

$db_repo = new DBRepository("tartarus.aserv.co.za:3306", "thabolao_naf_admin", "naf_admin_pw", "thabolao_naf_db");
if (!isset($_SERVER['PHP_AUTH_USER'])) {
  header('WWW-Authenticate: BASIC realm="user profile"');
  header('HTTP/1.0 401 Unauthorized');
  exit;
}

$handle = $_SERVER['PHP_AUTH_USER'];
$token = $_SERVER['PHP_AUTH_PW'];

[$user_id, $profile] = $db_repo->get_user_id_and_profile($handle, $token);

Router::get("/profiles", function () {
  global $profile;
  echo json_encode($profile);
  exit;
});

Router::get("/chats", function () {
  global $user_id, $db_repo;
  $chats = $db_repo->get_user_chats($user_id);
  echo json_encode($chats);
  exit;
});

Router::delete("/connections", "/(?<chat_handle>w/[a-zA-Z0-9-_]+)", function (array $matched_patterns) {
  global $user_id, $db_repo;
  if(count($matched_patterns) == 0) {
    header('HTTP/1.0 400 Bad Request');
    echo "missing handle in url";
    exit;
  }
  $chat_handle = $matched_patterns['chat_handle'];
  $db_repo->delete_user_chat($user_id, $chat_handle);
  header('HTTP/1.0 200 OK');
  echo "disconnected from $chat_handle";
  exit;
});

class MessageFormatException extends Exception
{
}

function validateMessage(array $message)
{
  if (!isset($message['toHandle'])) {
    throw new MessageFormatException("message missing field 'toHandle'");
  }
  if (!isset($message['text'])) {
    throw new MessageFormatException("message missing field 'text'");
  }
}

Router::post("/messages", function (string $body) {
  global $user_id, $db_repo;
  $message = (array) json_decode($body);
  try {
    validateMessage($message);
    $message_metadata = $db_repo->add_user_message($user_id, $message);
    if (count($message_metadata) == 0) {
      header('HTTP/1.0 404 Not Found');
      echo "user " . $message["toHandle"] . " not found";
      exit;
    }
    header('HTTP/1.0 201 Created');
    echo json_encode($message_metadata);
    exit;
  } catch (MessageFormatException $e) {
    header('HTTP/1.0 400 Bad Request');
    echo $e->getMessage();
    exit;
  } catch (Throwable $e) {
    var_dump($e);
    header('HTTP/1.0 500 Internal Server Error');
    exit;
  }
});

header('HTTP/1.0 404 Not Found');
exit;

?>