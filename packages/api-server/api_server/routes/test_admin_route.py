from ..test.test_fixtures import RouteFixture


class TestAdminRoute(RouteFixture):
    def test_query_users(self):
        # query usernames
        user = self.create_user()
        resp = self.session.get(f"{self.base_url}/admin/users?username={user}")
        self.assertEqual(200, resp.status_code)
        users = resp.json()
        self.assertIn(user, users)

        # query admins
        resp = self.session.get(f"{self.base_url}/admin/users?is_admin=true")
        self.assertEqual(200, resp.status_code)
        users = resp.json()
        self.assertIn("admin", users)

    def test_crud_user(self):
        username = self.create_user()

        resp = self.session.get(f"{self.base_url}/admin/users/{username}")
        self.assertEqual(200, resp.status_code)
        user = resp.json()
        self.assertEqual(username, user["username"])

        resp = self.session.delete(f"{self.base_url}/admin/users/{username}")
        self.assertEqual(200, resp.status_code)

        resp = self.session.get(f"{self.base_url}/admin/users/{username}")
        self.assertEqual(404, resp.status_code)

    def test_crud_roles(self):
        role = self.create_role()

        resp = self.session.get(f"{self.base_url}/admin/roles")
        self.assertEqual(200, resp.status_code)
        roles = resp.json()
        self.assertIn(role, roles)

        resp = self.session.delete(f"{self.base_url}/admin/roles/{role}")
        self.assertEqual(200, resp.status_code)

        resp = self.session.get(f"{self.base_url}/admin/roles")
        self.assertEqual(200, resp.status_code)
        self.assertNotIn(role, resp.json())

    def test_crud_role_permissions(self):
        role = self.create_role()
        self.add_permission(role, "test_action", "test_group")

        resp = self.session.get(
            f"{self.base_url}/admin/roles/{role}/permissions",
        )
        self.assertEqual(200, resp.status_code)
        permissions = resp.json()
        self.assertEqual(1, len(permissions))
        self.assertEqual("test_group", permissions[0]["authz_grp"])
        self.assertEqual("test_action", permissions[0]["action"])

        resp = self.session.delete(
            f"{self.base_url}/admin/roles/{role}/permissions",
            json={"action": "test_action", "authz_grp": "test_group"},
        )
        self.assertEqual(200, resp.status_code)

        resp = self.session.get(
            f"{self.base_url}/admin/roles/{role}/permissions",
        )
        self.assertEqual(200, resp.status_code)
        permissions = resp.json()
        self.assertEqual(0, len(permissions))

    def test_crud_user_roles(self):
        username = self.create_user()
        role = self.create_role()
        self.assign_role(username, role)

        resp = self.session.get(f"{self.base_url}/admin/users/{username}")
        self.assertEqual(200, resp.status_code)
        user = resp.json()
        self.assertEqual(1, len(user["roles"]))
        self.assertEqual(role, user["roles"][0])

        resp = self.session.delete(
            f"{self.base_url}/admin/users/{username}/roles", json={"name": role}
        )
        self.assertEqual(200, resp.status_code)

        resp = self.session.get(f"{self.base_url}/admin/users/{username}")
        self.assertEqual(200, resp.status_code)
        user = resp.json()
        self.assertEqual(0, len(user["roles"]))

    def test_put_user_roles(self):
        username = self.create_user()
        role = self.create_role()
        role2 = self.create_role()
        role3 = self.create_role()
        self.assign_role(username, role3)

        # error when one of the is invalid
        resp = self.session.put(
            f"{self.base_url}/admin/users/{username}/roles",
            json=[{"name": role}, {"name": "non_existing_role"}],
        )
        self.assertEqual(422, resp.status_code)

        resp = self.session.put(
            f"{self.base_url}/admin/users/{username}/roles",
            json=[{"name": role}, {"name": role2}],
        )
        self.assertEqual(200, resp.status_code)

        resp = self.session.get(f"{self.base_url}/admin/users/{username}")
        self.assertEqual(200, resp.status_code)
        user = resp.json()
        self.assertEqual(2, len(user["roles"]))
        self.assertIn(role, user["roles"])
        self.assertIn(role2, user["roles"])
        self.assertNotIn(role3, user["roles"])
