from assertpy import assert_that
from routes import TestCaseWithHTTP, Routes
from http import client
import json
import requests

class POSTNotifications(TestCaseWithHTTP):
  notificationsURL = f"{Routes.BASE_PATH}/notifications"

  def postNotifications(self, data):
    data_string = json.dumps(data)
    self.conn.request('POST', self.notificationsURL, data_string, self.authedHeaders)
    response = self.conn.getresponse()
    status, body = response.status, response.read().decode("utf-8")
    return status, body

  def testBadRequestOnMissingMessagesSince(self):
    """given a request body without the 'messagesSince' instruction it returns status 'Bad Request'"""
    missing_messages_since = {}
    status, body = self.postNotifications(missing_messages_since)    
    assert_that(status).is_equal_to(client.BAD_REQUEST)
    assert_that(body).is_equal_to("missing field 'messagesSince'")
  
  def testBadRequestOnMessagesSinceInvalidDateTime(self):
    """given a request body with an invalid 'messagesSince' time stamp it returns status 'Bad Request'"""
    bad_messages_since_timestamp = {
      'messagesSince': '2023/a1/1'
    }
    status, body = self.postNotifications(bad_messages_since_timestamp)
    assert_that(status).is_equal_to(client.BAD_REQUEST)
    assert_that(body).is_equal_to("instruction field 'messagesSince' should be format '%Y-%m%d %H:%M:%S'")
  
  def _testNewMessageEventCodeOnNewMessage(self):
    """
    Manual test - when a user is sent a new message, the response stream changes from IDLE event
    codes '0' to NEW_MESSAGE event codes '1'
    
    Produce behaviour:
      1. Change 'messageSince' in request payload to latest date past which the user has no messages;
      2. Run this test
      3. Add a new message with 'to_user' = 1 in SQL;
    and the streamed response here should the start producing different results.
    
    Ideally: we would send two requests, in parallel, from two different users - one for listening to
    notifications and one for posting a new message and then assert that the listener does get the new
    message event code when the post message is complete. However, we cannot do this since requests can 
    only be executed sequentially from the same development machine.
    """
    data = json.dumps({
      'messagesSince': '2023/1/13'
    })
    response = requests.post("http://localhost:8000" + self.notificationsURL, data, stream=True, headers=self.authedHeaders)
    for data in response.iter_content():
      print(data)