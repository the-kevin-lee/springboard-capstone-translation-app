import unittest
from app import app


class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # testing backend functionality

    def test_home(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Backend is working..', response.data)

    def test_translation(self):
        response = self.app.post('/translate', json={
            "inputText": "Hello",
            "targetLanguage": "FR"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'translation', response.data)


if __name__ == '__main__':
    unittest.main()