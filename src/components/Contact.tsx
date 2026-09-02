import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import '../assets/styles/Contact.scss';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#050f0b',
  WebkitTextFillColor: '#050f0b',
  caretColor: '#050f0b',
  opacity: 1,
  border: '1px solid #777',
  borderRadius: '4px',
  padding: '16.5px 14px',
  fontFamily: 'Lato, sans-serif',
  fontSize: '1rem',
  outline: 'none',
};

const messageStyle: React.CSSProperties = {
  ...fieldStyle,
  minHeight: '250px',
  resize: 'vertical',
  lineHeight: 1.5,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '7px',
  color: '#050f0b',
  fontSize: '1.05rem',
  fontFamily: 'DomaineDispNar-Medium, sans-serif',
};

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

    if (hasNameError || hasEmailError || hasMessageError) return;
    if (!form.current) return;

    setSending(true);
    setStatus('');

    try {
      await emailjs.sendForm(
        'service_rulvpmk',
        'template_3wagmzk',
        form.current,
        { publicKey: '-Y-o-mn_TDpvIYzzm' }
      );

      setStatus('Message envoyé avec succès !');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erreur EmailJS:', error);
      setStatus("Une erreur est survenue. Le message n'a pas pu être envoyé.");
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
              <div className="contact-field">
                <label htmlFor="contact-name" style={labelStyle}>Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="What's your name?"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(false); }}
                  aria-invalid={nameError}
                  style={fieldStyle}
                  autoComplete="name"
                />
                {nameError && <small className="contact-error">Please enter your name</small>}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email" style={labelStyle}>Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="How can I reach you?"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                  aria-invalid={emailError}
                  style={fieldStyle}
                  autoComplete="email"
                />
                {emailError && <small className="contact-error">Please enter your email</small>}
              </div>
            </div>

            <div className="contact-field body-form">
              <label htmlFor="contact-message" style={labelStyle}>Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Send me any inquiries or questions"
                value={message}
                onChange={(e) => { setMessage(e.target.value); setMessageError(false); }}
                aria-invalid={messageError}
                style={messageStyle}
              />
              {messageError && <small className="contact-error">Please enter your message</small>}
            </div>

            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={sending}>
              {sending ? 'Sending...' : 'Send'}
            </Button>

            {status && <p className="contact-status">{status}</p>}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Contact;
