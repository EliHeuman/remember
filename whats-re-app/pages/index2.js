import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Client } from 'whatsapp-web.js';
//import AddParticipants from './AddParticipants';
const IndexPage = () => {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const initializeClient = async () => {
      // Initialize the client
      const client = new Client();

      // Authenticate the client
      client.on('qr', (qr) => {
        console.log(qr);
        // Display the QR code and wait for the user to scan it
      });
      client.on('authenticated', (session) => {
        console.log('Authenticated');
        // Save the session to use later for authentication
      });
      await client.initialize();

      setClient(client);
    };

    initializeClient();
  }, []);

  const handleSendMessage = async () => {
    if (!client) {
      console.log('Client not initialized');
      return;
    }

    const messageData = {
      phone,
      message: {
        component: {
          type: 'template',
          template: {
            namespace: 'your-namespace',
            name: 'your-template-name',
            language: {
              policy: 'deterministic',
              code: 'en'
            },
            components: [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: message
                  }
                ]
              }
            ]
          }
        }
      }
    };

    try {
      const response = await client.messages.sendTemplate(messageData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Head>
        <title>WhatsApp Web for Business</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>WhatsApp Web for Business</h1>

        <form>
          <label>
            Phone:
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <br />
          <label>
            Message:
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <br />
          <button type="button" onClick={handleSendMessage}>Send Message</button>
        </form>
    <div>
      <h1>Add Participants to WhatsApp Group</h1>
      
    </div>
      </main>
    </div>
  );
};

export default IndexPage;
