import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import '../assets/styles/Contact.scss';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

function Contact() {
  const form = useRef<HTMLFormElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasNameError = name.trim() === '';
    const hasEmailError = email.trim() === '';
    const hasMessageError = message.trim() === '';

    setNameError(hasNameError);
    setEmailError(hasEmailError);
    setMessageError(hasMessageError);

    if (hasNameError || hasEmailError || hasMessageError) {
      setStatus('');
      return;
    }

    if (!form.current) return;

    setSending(true);
    setStatus('');

    try {
      await emailjs.sendForm(
        'service_rulvpmk',
        'template_3wagmzk',
        form.current,
        {
          publicKey: '-Y-o-mn_TDpvIYzzm'
        }
      );

      setStatus('Message envoyé avec succès !');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      setStatus(
        "Une erreur est survenue. Le message n'a pas pu être envoyé."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="contact">
      <div className="items-container">
        <div className="contact_wrapper">

          <h1>Contact Me</h1>

          <p>
            Got a project waiting to be realized?
            Let's collaborate and make it happen!
          </p>

          <Box
            ref={form}
            component="form"
            className="contact-form"
            onSubmit={sendEmail}
            noValidate
            autoComplete="off"
          >

            <div className="form-flex">

              <TextField
                required
                label="Your Name"
                placeholder="What's your name?"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={nameError}
                helperText={
                  nameError ? 'Please enter your name' : ''
                }
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#050f0b',
                    WebkitTextFillColor: '#050f0b',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#050f0b',
                  },
                }}
              />

              <TextField
                required
                type="email"
                label="Email"
                placeholder="How can I reach you?"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={
                  emailError ? 'Please enter your email' : ''
                }
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#050f0b',
                    WebkitTextFillColor: '#050f0b',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#050f0b',
                  },
                }}
              />

            </div>

            <TextField
              required
              label="Message"
              placeholder="Send me any inquiries or questions"
              name="message"
              multiline
              rows={10}
              className="body-form"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={messageError}
              helperText={
                messageError ? 'Please enter your message' : ''
              }
              sx={{
                  '& .MuiInputBase-input': {
                    color: '#050f0b',
                    WebkitTextFillColor: '#050f0b',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#050f0b',
                  },
                }}
            />

            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send'}
            </Button>

            {status && (
              <p className="contact-status">
                {status}
              </p>
            )}

          </Box>

        </div>
      </div>
    </div>
  );
}

export default Contact;
