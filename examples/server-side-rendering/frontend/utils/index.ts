function getItem(key: string, emit?: string) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    if (emit) {
      throw new Error(emit);
    }

    return null;
  }
}

function setItem(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function checkId(id: unknown) {
  const isValid = typeof id === 'number' && !Number.isNaN(id);

  if (!isValid) {
    throw new Error('Invalid id!');
  }
}

function checkResponse(response: Response) {
  if (!response.ok) throw new Error(`${response.status}`);
}

const headers = () => ({ 'Content-Type': 'application/json' });

export { getItem, setItem, checkId, checkResponse, headers };
