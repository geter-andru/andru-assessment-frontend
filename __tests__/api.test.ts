import { apiService } from '../lib/api';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('startAssessment should call correct endpoint', async () => {
    const mockResponse = {
      success: true,
      sessionId: 'test-session',
      recordId: 'test-record'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiService.startAssessment({
      sessionId: 'test-session',
      startTime: '2023-01-01T00:00:00.000Z'
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/assessment/start',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: 'test-session',
          startTime: '2023-01-01T00:00:00.000Z'
        })
      })
    );

    expect(result).toEqual(mockResponse);
  });

  test('getHealth should call correct endpoint', async () => {
    const mockResponse = {
      status: 'healthy',
      timestamp: '2023-01-01T00:00:00.000Z',
      version: '1.0.0',
      uptime: 1000,
      memory: { used: 100, total: 200, external: 50 },
      environment: 'test'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiService.getHealth();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/health',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        }
      })
    );

    expect(result).toEqual(mockResponse);
  });
});
