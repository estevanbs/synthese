import axios from 'axios';

describe('POST /api/synthesize', () => {
  let topicId: number;

  beforeAll(async () => {
    const res = await axios.post('/api/topics', {
      name: 'E2E Synthesize Topic',
    });
    topicId = res.data.id;
  });

  it('should save raw text and return 200 with no body', async () => {
    const res = await axios.post('/api/synthesize', {
      text: 'Some raw thoughts about quantum mechanics',
      topicId,
    });

    expect(res.status).toBe(200);
    expect(res.data).toBe('');
  });

  it('should return 400 when text is missing', async () => {
    const res = await axios
      .post('/api/synthesize', { topicId })
      .catch((e) => e.response);

    expect(res.status).toBe(400);
  });

  it('should return 400 when topicId is missing', async () => {
    const res = await axios
      .post('/api/synthesize', { text: 'some text' })
      .catch((e) => e.response);

    expect(res.status).toBe(400);
  });

  it('should return 400 when body is empty', async () => {
    const res = await axios
      .post('/api/synthesize', {})
      .catch((e) => e.response);

    expect(res.status).toBe(400);
  });
});
