import axios from 'axios';

describe('POST /api/topics', () => {
  it('should create a topic', async () => {
    const res = await axios.post('/api/topics', { name: 'Physics' });

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({
      id: expect.any(Number),
      name: 'Physics',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should return 400 when name is missing', async () => {
    const res = await axios
      .post('/api/topics', {})
      .catch((e) => e.response);

    expect(res.status).toBe(400);
  });

  it('should return 400 when name is empty', async () => {
    const res = await axios
      .post('/api/topics', { name: '' })
      .catch((e) => e.response);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/topics', () => {
  it('should return a list of topics', async () => {
    const res = await axios.get('/api/topics');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThanOrEqual(1);
    expect(res.data[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });
});

describe('GET /api/topics/:id', () => {
  it('should return a topic by id', async () => {
    const created = await axios.post('/api/topics', {
      name: 'Mathematics',
    });
    const id = created.data.id;

    const res = await axios.get(`/api/topics/${id}`);

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      id,
      name: 'Mathematics',
    });
  });
});
