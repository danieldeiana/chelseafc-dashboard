import unittest
import app
import flask
import pymongo


class app_tests(unittest.TestCase):
    def test_app_is_flask_instance(self):
        self.assertIsInstance(app.app, flask.Flask,
            '{} is not an instance of {}'.format(app.app, flask.Flask))

    def test_database_fields_filled_correctly(self):
        self.assertIsInstance(
            app.MONGODB_HOST, str, '{} should be a string'.format(app.MONGODB_HOST))

        self.assertIsInstance(
            app.MONGODB_PORT, int, '{} should be an integer'.format(app.MONGODB_PORT))

        self.assertIsInstance(
            app.DBS_NAME, str, '{} should be a string'.format(app.DBS_NAME))

        self.assertIsInstance(
            app.COLLECTION_NAME, str, '{} should be a string'.format(app.COLLECTION_NAME))

    def test_mongo_cursor_object_returned(self):
        seasons_object = app.get_seasons()
        self.assertIsInstance(
            seasons_object, pymongo.cursor.Cursor, '{} is not a pymongo.cursor.Cursor object'.format(seasons_object))

    def test_str_returned_when_data_converted_from_get_seasons(self):
        data = app.convert_collection_to_json(app.get_seasons())
        self.assertIsInstance(
            data, str,
            'An object as a string was not created feeding mongo return data to convert_collection_to_json method')

    def test_flask_routes(self):
        test_app = app.app.test_client()

        response = test_app.get('/')
        status_code = response.status_code
        self.assertEqual(status_code, 200)

        response = test_app.get('/cfcdvdv/seasons')
        status_code = response.status_code
        self.assertEqual(status_code, 200)

        self.assertNotEqual(response.data, None)
        self.assertIsInstance(response.data, str)


if __name__ == '__main__':
    unittest.main()
