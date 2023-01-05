import http.client
import unittest
import base64
import json
from datetime import datetime
from assertpy import assert_that

def encodeAuthCredentials(username: str, password: str) -> str:
  credentials: str = ':'.join([username, password])
  credentials_bytes = credentials.encode('utf-8')
  base64_bytes = base64.b64encode(credentials_bytes)
  credentials_b64 = base64_bytes.decode('utf-8')
  return credentials_b64

class POSTMessages(unittest.TestCase):
  messagesURL = '/backend/messages'
  handle = 'w/testHandle'
  token = 'testToken'
  connectedUser = 'w/testHandle2'
  authedHeaders = {
      "Authorization" : " ".join(["Basic", encodeAuthCredentials(handle, token)]),
  }
  messageText = "test text"

  def postMessage(self, message: dict, headers: dict = None) -> tuple:
    valid_headers = self.authedHeaders if headers == None else headers
    json_message = json.dumps(message)
    self.conn.request('POST', self.messagesURL, json_message, valid_headers)
    response = self.conn.getresponse()
    status = response.status
    body = response.read().decode("utf-8")
    return status, body
  
  def setUp(self) -> None:
    self.conn = http.client.HTTPConnection("localhost", 8000)
    
  def testUnauthOnBadCredentials(self):
    """given unregistered user authorization credentials it returns 'Unauthorized'"""
    unregisteredHandle = 'w/someUnregisteredHandle'
    unregisteredToken = 'someUnregisteredTestToken'
    validMessage = {
      "text": self.messageText,
      "toHandle": self.connectedUser,
      "timestamp": 0,
    }
    encoded_bad_credentials = encodeAuthCredentials(unregisteredHandle, unregisteredToken)
    badAuthheaders = {
      "Authorization" : " ".join(["Basic", encoded_bad_credentials]),
    }

    status, _ = self.postMessage(validMessage, badAuthheaders)
    assert_that(status).is_equal_to(http.client.UNAUTHORIZED)

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

    time_before_request = datetime.now()
    status, body = self.postMessage(message)
    time_after_request = datetime.now()
    assert_that(status).is_equal_to(http.client.CREATED)
    result: dict = json.loads(body)
    assert_that(result).contains_key("timestamp")
    timestamp = datetime.strptime(result["timestamp"], '%Y-%m-%d %H:%M:%S')
    assert_that(timestamp).is_before(time_after_request)
    assert_that(timestamp).is_equal_to_ignoring_milliseconds(time_before_request)

if __name__ == "__main__":
  unittest.main() # run all tests