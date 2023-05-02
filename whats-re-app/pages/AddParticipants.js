import React, { useState } from 'react';
//import Papa from 'papaparse';
import axios from 'axios';

function AddParticipants() {
  const [groupLink, setGroupLink] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [participants, setParticipants] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data;
        setParticipants(data);
        setCsvFile(file);
      }
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Create new WhatsApp group
    axios.post('/api/whatsapp/groups', { link: groupLink })
      .then(response => {
        const groupId = response.data.groupId;

        // Add participants to the WhatsApp group
        axios.post('/api/whatsapp/groups/addParticipants', { groupId, participants })
          .then(response => {
            alert('Participants added successfully!');
          })
          .catch(error => {
            console.error(error);
            alert('Failed to add participants to the group.');
          });
      })
      .catch(error => {
        console.error(error);
        alert('Failed to create a new group.');
      });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>
          WhatsApp Group Link:
          <input type="text" value={groupLink} onChange={(e) => setGroupLink(e.target.value)} />
        </label>
        <label>
          Participants List:
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </label>
        <button type="submit">Add Participants</button>
      </form>
    </div>
  );
}

export default AddParticipants;
