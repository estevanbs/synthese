import { SYSTEM_PROMPT } from './prompts';

describe('SYSTEM_PROMPT', () => {
  it('should include the core business rules for cumulative notes', () => {
    expect(SYSTEM_PROMPT).toContain('Always respond with valid JSON');
    expect(SYSTEM_PROMPT).toContain('"entries"');
    expect(SYSTEM_PROMPT).toContain('"topicName"');
    expect(SYSTEM_PROMPT).toContain('clean title only');
    expect(SYSTEM_PROMPT).toContain('two different topics');
    expect(SYSTEM_PROMPT).toContain('existing note');
    expect(SYSTEM_PROMPT).toContain('same language');
    expect(SYSTEM_PROMPT).toContain('Never invent facts');
  });
});
