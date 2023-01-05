import http.client
import unittest
import base64
import json
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

  def postMessage(self, message, headers=None):
    self.conn.request('POST', self.messagesURL, message, self.authedHeaders if headers == None else headers)
    return self.conn.getresponse()
  
  def setUp(self) -> None:
    self.conn = http.client.HTTPConnection("localhost", 8000)
    
  def testUnauthOnBadCredentials(self):
    """given unregistered user authorization credentials it returns 'Unauthorized'"""
    unregisteredHandle = 'w/someUnregisteredHandle'
    unregisteredToken = 'someUnregisteredTestToken'
    validMessage = json.dumps({
      "text": "test text",
      "toHandle": self.connectedUser,
      "timestamp": 0,
    })
    encoded_bad_credentials = encodeAuthCredentials(unregisteredHandle, unregisteredToken)
    badAuthheaders = {
      "Authorization" : " ".join(["Basic", encoded_bad_credentials]),
    }

    response = self.postMessage(validMessage, badAuthheaders)
    assert_that(response.status).is_equal_to(http.client.UNAUTHORIZED)

  def testBadReqOnMissingRecipient(self):
    """given a message without a 'toHandle' field it returns status 'Bad Request'"""
    messageMissingReceipient = json.dumps({
      "text": "test text",
    })

    response = self.postMessage(messageMissingReceipient)
    assert_that(response.status).is_equal_to(http.client.BAD_REQUEST)
    response_body = response.read().decode("utf-8")
    assert_that(response_body).is_equal_to("message missing field 'toHandle'")

  def testBadRequestOnMissingText(self):
    """given a message without a 'text' field it returns status 'Bad Request'"""
    messageMissingText = json.dumps({
      "toHandle": self.connectedUser,
    })

    response = self.postMessage(messageMissingText)
    assert_that(response.status).is_equal_to(http.client.BAD_REQUEST)
    response_body = response.read().decode("utf-8")
    assert_that(response_body).is_equal_to("message missing field 'text'")

  def testNotFoundOnUnconnectedUserHandle(self):
    """given a message with a 'toHandle' for a user we are not connected to it returns status 'Not Found'"""
    unnconnectedUser = "w/someUnconnectedUser"
    message = json.dumps({
      "text": "message text",
      "toHandle": unnconnectedUser,
    })
    response = self.postMessage(message, self.authedHeaders)
    assert_that(response.status).is_equal_to(http.client.NOT_FOUND)
    response_body = response.read().decode("utf-8")
    assert_that(response_body).is_equal_to(f"user {unnconnectedUser} not found")

if __name__ == "__main__":
  unittest.main() # run all tests