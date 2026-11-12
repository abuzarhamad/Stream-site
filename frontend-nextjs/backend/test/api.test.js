import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { resetDataStore } from '../src/data/store.js';

const api = request(app);

test.beforeEach(async () => {
  resetDataStore();
});

test('signup and me endpoint work', async () => {
  const agent = request.agent(app);

  const signupRes = await agent
    .post('/api/auth/signup')
    .send({
      fullName: 'Alice User',
      email: 'alice@example.com',
      password: 'password123',
    })
    .expect(201);

  assert.equal(signupRes.body.user.email, 'alice@example.com');
  assert.equal(signupRes.body.user.fullName, 'Alice User');

  const meRes = await agent.get('/api/auth/me').expect(200);
  assert.equal(meRes.body.user.email, 'alice@example.com');
});

test('onboarding updates the profile and friend request flow works', async () => {
  const alice = request.agent(app);
  const bob = request.agent(app);

  const aliceSignup = await alice
    .post('/api/auth/signup')
    .send({
      fullName: 'Alice User',
      email: 'alice@example.com',
      password: 'password123',
    })
    .expect(201);

  const bobSignup = await bob
    .post('/api/auth/signup')
    .send({
      fullName: 'Bob User',
      email: 'bob@example.com',
      password: 'password123',
    })
    .expect(201);

  await alice
    .post('/api/auth/onboarding')
    .send({
      nativeLanguage: 'English',
      learningLanguages: ['Spanish'],
      proficiency: 'intermediate',
    })
    .expect(200);

  await alice
    .post(`/api/user/friend-request/${bobSignup.body.user._id}`)
    .expect(201);

  const friendRequestsRes = await bob.get('/api/user/friend-requests').expect(200);
  assert.equal(friendRequestsRes.body.friendRequests.length, 1);
  assert.equal(friendRequestsRes.body.friendRequests[0].senderId.fullName, 'Alice User');

  await bob
    .put(`/api/user/friend-request/${aliceSignup.body.user._id}/accept`)
    .expect(200);

  const friendsRes = await bob.get('/api/user/friends').expect(200);
  assert.equal(friendsRes.body.friends.length, 1);
  assert.equal(friendsRes.body.friends[0].fullName, 'Alice User');
});
