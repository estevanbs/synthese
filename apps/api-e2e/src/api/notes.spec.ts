import axios from 'axios';

describe('GET /api/notes/topic/:topicId', () => {
  it('should return 404 when no note exists for the topic', async () => {
    const topic = await axios.post('/api/topics', { name: 'Notes E2E Topic No Note' });
    const topicId = topic.data.id;

    const res = await axios
      .get(`/api/notes/topic/${topicId}`)
      .catch((e) => e.response);

    expect(res.status).toBe(404);
  });

  it('should return 400 when topicId is not a number', async () => {
    const res = await axios
      .get('/api/notes/topic/not-a-number')
      .catch((e) => e.response);

    expect(res.status).toBe(400);
  });
});
