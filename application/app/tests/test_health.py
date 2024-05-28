from base import RideTest
import unittest 

class TestHealth(RideTest): 
    def test_health(self): 
        response = self.client.get('/health') 
        self.assertEqual(response.status_code, 200) 
        self.assertEqual(response.json, {'status': 'ok'})


if __name__ == '__main__':
    unittest.main()
