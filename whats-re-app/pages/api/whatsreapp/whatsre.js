// pages/api/whatsapp/groups.js
import { Client } from 'whatsapp-web.js';
import { getSession } from 'next-auth/client';
import { promisify } from 'util';
import { parse } from 'papaparse';
import { authenticate, checkAuthentication } from './_lib/auth';

const client = new Client();

// Authenticate the client on start up
(async () => {
  await authenticate(client);
})();

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // Check if client is authenticated
  const isAuthenticated = await checkAuthentication(client);
  if (!isAuthenticated) {
    res.status(500).json({ message: 'Failed to authenticate client' });
    return;
  }

  if (req.method === 'POST') {
    const { link } = req.body;

    // Create new group
    const group = await client.groupCreate(link);

    if (!group) {
      res.status(500).json({ message: 'Failed to create group' });
      return;
    }

    const { id: groupId } = group;

    // Get the CSV file from the request body and parse it
    const { data } = parse(req.body.csvFile);

    // Remove header row
    data.shift();

    // Add participants to group
    const participants = await promisify(client.addParticipants).bind(client)(groupId, data);

    if (!participants) {
      res.status(500).json({ message: 'Failed to add participants to group' });
      return;
    }

    res.status(200).json({ message: 'Participants added successfully' });
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
}
