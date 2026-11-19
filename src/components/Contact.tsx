import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import '../assets/styles/Contact.scss';
import { useLanguage } from '../i18n/LanguageContext';

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
  fontFamily: 'var(--font-body)',
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
  fontFamily: 'var(--font-display)',
};

function Contact() {
  const { t } = useLanguage();
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

      setStatus(t({ fr: 'Message envoyé avec succès !', en: 'Message sent successfully!', tr: 'Mesaj başarıyla gönderildi!', zh: '消息发送成功！', ru: 'Сообщение успешно отправлено!' }));
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erreur EmailJS :', error);
      setStatus(t({ fr: 'Une erreur est survenue. Le message n’a pas pu être envoyé.', en: 'Something went wrong. The message could not be sent.', tr: 'Bir hata oluştu. Mesaj gönderilemedi.', zh: '出错了，消息未能发送。', ru: 'Произошла ошибка. Сообщение не удалось отправить.' }));
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="contact">
      <div className="items-container">
        <div className="contact_wrapper">
          <h1 aria-level={2}>{t({ fr: 'Me contacter', en: 'Contact me', tr: 'Benimle iletişime geçin', zh: '联系我', ru: 'Связаться со мной' })}</h1>
          <p>
            {t({ fr: 'Vous avez un projet à concrétiser ?', en: 'Have a project to bring to life?', tr: 'Hayata geçirmek istediğiniz bir projeniz mi var?', zh: '有想要实现的项目吗？', ru: 'Есть проект, который нужно воплотить?' })}
            <br />
            {t({ fr: 'Échangeons pour lui donner vie !', en: 'Let’s talk and make it happen!', tr: 'Konuşalım ve birlikte hayata geçirelim!', zh: '让我们聊聊，把它变成现实！', ru: 'Давайте обсудим и воплотим его в жизнь!' })}
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
                <label htmlFor="contact-name" style={labelStyle}>{t({ fr: 'Votre nom', en: 'Your name', tr: 'Adınız', zh: '您的姓名', ru: 'Ваше имя' })}</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder={t({ fr: 'Quel est votre nom ?', en: 'What is your name?', tr: 'Adınız nedir?', zh: '请问您的姓名？', ru: 'Как вас зовут?' })}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(false); }}
                  aria-invalid={nameError}
                  style={fieldStyle}
                  autoComplete="name"
                />
                {nameError && <small className="contact-error">{t({ fr: 'Veuillez saisir votre nom.', en: 'Please enter your name.', tr: 'Lütfen adınızı girin.', zh: '请输入您的姓名。', ru: 'Пожалуйста, введите ваше имя.' })}</small>}
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email" style={labelStyle}>{t({ fr: 'Adresse e-mail', en: 'Email address', tr: 'E-posta adresi', zh: '电子邮箱', ru: 'Адрес эл. почты' })}</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder={t({ fr: 'Comment puis-je vous joindre ?', en: 'How can I reach you?', tr: 'Size nasıl ulaşabilirim?', zh: '我该如何联系您？', ru: 'Как с вами связаться?' })}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                  aria-invalid={emailError}
                  style={fieldStyle}
                  autoComplete="email"
                />
                {emailError && <small className="contact-error">{t({ fr: 'Veuillez saisir votre adresse e-mail.', en: 'Please enter your email address.', tr: 'Lütfen e-posta adresinizi girin.', zh: '请输入您的电子邮箱。', ru: 'Пожалуйста, введите адрес эл. почты.' })}</small>}
              </div>
            </div>

            <div className="contact-field body-form">
              <label htmlFor="contact-message" style={labelStyle}>{t({ fr: 'Message', en: 'Message', tr: 'Mesaj', zh: '留言', ru: 'Сообщение' })}</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder={t({ fr: 'Écrivez votre message ou votre demande.', en: 'Write your message or request.', tr: 'Mesajınızı veya talebinizi yazın.', zh: '请写下您的留言或需求。', ru: 'Напишите ваше сообщение или запрос.' })}
                value={message}
                onChange={(e) => { setMessage(e.target.value); setMessageError(false); }}
                aria-invalid={messageError}
                style={messageStyle}
              />
              {messageError && <small className="contact-error">{t({ fr: 'Veuillez saisir votre message.', en: 'Please enter your message.', tr: 'Lütfen mesajınızı girin.', zh: '请输入您的留言。', ru: 'Пожалуйста, введите сообщение.' })}</small>}
            </div>

            <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={sending}>
              {sending
                ? t({ fr: 'Envoi en cours…', en: 'Sending…', tr: 'Gönderiliyor…', zh: '发送中…', ru: 'Отправка…' })
                : t({ fr: 'Envoyer', en: 'Send', tr: 'Gönder', zh: '发送', ru: 'Отправить' })}
            </Button>

            {status && <p className="contact-status">{status}</p>}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Contact;
