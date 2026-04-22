import axios from 'axios';

describe('POST /api/synthesize', () => {
  it('should return 400 when text is missing', async () => {
    const res = await axios.post('/api/synthesize', {}).catch((e) => e.response);
    expect(res.status).toBe(400);
  });

  it('should return 400 when text is not a string', async () => {
    const res = await axios
      .post('/api/synthesize', { text: 123 })
      .catch((e) => e.response);
    expect(res.status).toBe(400);
  });

  it('should return 400 when text is empty', async () => {
    const res = await axios
      .post('/api/synthesize', { text: '' })
      .catch((e) => e.response);
    expect(res.status).toBe(400);
  });

  // Requires ANTHROPIC_API_KEY env var to be set
  it('should process notes and return topic entries', async () => {
    if (!process.env['ANTHROPIC_API_KEY']) {
      console.warn('Skipping AI test: ANTHROPIC_API_KEY not set');
      return;
    }

    const res = await axios.post('/api/synthesize', {
      text: 'I just finished chapter 3 of Dune. Paul and Jessica escaped into the desert.',
    });

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      entries: expect.arrayContaining([
        expect.objectContaining({
          topicId: expect.any(Number),
          topicName: expect.any(String),
          confirmation: expect.any(String),
        }),
      ]),
    });
  });
});
