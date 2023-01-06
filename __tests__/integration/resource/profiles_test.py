from assertpy import assert_that
from routes import TestCaseWithHTTP, Routes
from http import client
import json

class GETProfiles(TestCaseWithHTTP):
  profilesURL = f"{Routes.BASE_PATH}/profiles"

  def testOKOnAuthedUser(self):
    """given a request by an authed user it should return their profile and status 'OK'"""
    expectedProfile = {
      "handle": self.handle,
    }
    self.conn.request('GET', self.profilesURL, headers=self.authedHeaders)
    response = self.conn.getresponse()
    status = response.status
    body = response.read().decode("utf-8")
    assert_that(status).is_equal_to(client.OK)
    profile = json.loads(body)
    assert_that(profile).is_equal_to(expectedProfile)
