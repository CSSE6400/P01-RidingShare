import sys
sys.path.append("..")

from app import create_app
import unittest 

class RideTest(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config_overrides={
            'SQLALCHEMY_DATABASE_URI': 'postgresql+psycopg://administrator:verySecretPassword@localhost:5432/ride',
            'TESTING': True
        })
        self.client = self.app.test_client()


    def assertDictSubset(self, expected_subset: dict, whole: dict): 
        for key, value in expected_subset.items(): 
            self.assertEqual(whole[key], value)
