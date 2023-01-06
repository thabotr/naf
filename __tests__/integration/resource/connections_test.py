from assertpy import assert_that
from routes import TestCaseWithHTTP, Routes
from http import client

class DELETEConnection(TestCaseWithHTTP):
  connectionsURL = f"{Routes.BASE_PATH}/connections"

  def deleteConnection(self, handle=None):
    handle_uri = f"/{handle}" if handle else ""
    url = f"{self.connectionsURL}{handle_uri}"
    self.conn.request('DELETE', url, headers=self.authedHeaders)
    response = self.conn.getresponse()
    status = response.status
    body = response.read().decode("utf-8")
    return status, body

  def testBadRequestOnMissingHandleInURL(self):
    """given a url without the handle it returns 'Bad Request'"""
    status, body = self.deleteConnection()
    assert_that(status).is_equal_to(client.BAD_REQUEST)
    assert_that(body).is_equal_to("missing handle in url")
    
  def testBadRequestOnMalformedHandleInURL(self):
    """given a url with a malformed handle it returns 'Bad request'"""
    malformedHandleWoutSlash = "wtestOneTwo3"
    status, body = self.deleteConnection(malformedHandleWoutSlash)
    assert_that(status).is_equal_to(client.BAD_REQUEST)
    assert_that(body).is_equal_to("missing handle in url")
  
  def testOKOnConnectedUserHandleInURL(self):
    """given a url with the handle of a connected user it returns 'OK'"""
    status, body = self.deleteConnection(self.secondConnectedUser)
    assert_that(status).is_equal_to(client.OK)
    assert_that(body).is_equal_to(f"disconnected from {self.secondConnectedUser}")

  def testOKOnNonConnectedUserInURL(self):
    """gievn a url with the handle of a non-connected user it returns 'OK'"""
    unconnectedUser = "w/someOtherHandle"
    status, body = self.deleteConnection(unconnectedUser)
    assert_that(status).is_equal_to(client.OK)
    assert_that(body).is_equal_to(f"disconnected from {unconnectedUser}")