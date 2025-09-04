/// <reference lib="webworker" />

// Define the shape of the data we expect to receive from the main thread
interface WorkerData {
    file: File;
    domainId: string;
    apiUrl: string;
    authToken: string | null;
}

// Listen for messages from the main React component
self.onmessage = (event: MessageEvent<WorkerData>) => {
    const { file, domainId, apiUrl, authToken } = event.data;

    const formData = new FormData();
    formData.append('domain_id', domainId);
    formData.append('file', file);
    formData.append('title', '');
    formData.append('author', '');
    formData.append('language', '');
    
    // Define headers, including Authorization if a token is provided
    const headers: HeadersInit = {};
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: headers,
    })
    .then(response => {
        if (!response.ok) {
            // If the server returns an error, pass it back to the main thread
            return response.json().then(errorData => {
                // We throw an error here to be caught by the .catch() block
                throw new Error(JSON.stringify(errorData));
            });
        }
        return response.json();
    })
    .then(data => {
        // On success, send the result back to the main thread
        self.postMessage({ status: 'success', data: data });
    })
    .catch(error => {
        // On failure, send the error message back
        self.postMessage({ status: 'error', error: error.message });
    });
};

// This export is needed to satisfy the TypeScript module system.
export default {};