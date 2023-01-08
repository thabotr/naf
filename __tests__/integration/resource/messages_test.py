import http.client
import unittest
import json
from datetime import datetime
from assertpy import assert_that
from routes import Routes, TestCaseWithHTTP

class POSTMessages(TestCaseWithHTTP):
  def testBadReqOnMissingRecipient(self):
    """given a message without a 'toHandle' field it returns status 'Bad Request'"""
    messageMissingReceipient = {
      "text": self.messageText,
    }

    status, body = self.postMessage(messageMissingReceipient)
    assert_that(status).is_equal_to(http.client.BAD_REQUEST)
    assert_that(body).is_equal_to("message missing field 'toHandle'")

  def testBadRequestOnMissingText(self):
    """given a message without a 'text' field it returns status 'Bad Request'"""
    messageMissingText = {
      "toHandle": self.connectedUser,
    }

    status, body = self.postMessage(messageMissingText)
    assert_that(status).is_equal_to(http.client.BAD_REQUEST)
    assert_that(body).is_equal_to("message missing field 'text'")

  def testNotFoundOnUnconnectedUserHandle(self):
    """given a message with a 'toHandle' for a user we are not connected to it returns status 'Not Found'"""
    unnconnectedUser = "w/someUnconnectedUser"
    message = {
      "text": self.messageText,
      "toHandle": unnconnectedUser,
    }
    status, body = self.postMessage(message, self.authedHeaders)
    assert_that(status).is_equal_to(http.client.NOT_FOUND)
    assert_that(body).is_equal_to(f"user {unnconnectedUser} not found")

  def testCreatedOnValidMessage(self):
    """given a valid message it returns status 'Created' and an object with a valid timestamp"""
    message = {
      "text": self.messageText,
      "toHandle": self.connectedUser,
    }
    status, body = self.postMessage(message)
    assert_that(status).is_equal_to(http.client.CREATED)
    result: dict = json.loads(body)
    assert_that(result).contains_key("timestamp")
    _ = datetime.strptime(result["timestamp"], '%Y-%m-%d %H:%M:%S')

  def postMessage(self, message: dict, headers: dict = None) -> tuple:
    valid_headers = self.authedHeaders if headers == None else headers
    json_message = json.dumps(message)
    self.conn.request('POST', self.messagesURL, json_message, valid_headers)
    response = self.conn.getresponse()
    status = response.status
    body = response.read().decode("utf-8")
    return status, body

  messagesURL = f"{Routes.BASE_PATH}/messages"
  messageText = "test text"
  
if __name__ == "__main__":
  unittest.main() # run all tests