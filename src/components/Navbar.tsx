'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    const onMenu = () => {
      document.body.classList.toggle('mobile-menu-open');
      navLinks?.classList.toggle('open');
    };
    hamburger?.addEventListener('click', onMenu);

    const links = document.querySelectorAll('.nav-links a');
    const onLink = () => {
      document.body.classList.remove('mobile-menu-open');
      navLinks?.classList.remove('open');
    };
    links.forEach(l => l.addEventListener('click', onLink));

    const sections = document.querySelectorAll('section[id]');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinksAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => obs.observe(s));

    return () => {
      hamburger?.removeEventListener('click', onMenu);
      links.forEach(l => l.removeEventListener('click', onLink));
      obs.disconnect();
      document.body.classList.remove('mobile-menu-open');
      navLinks?.classList.remove('open');
    };
  }, []);

  return (
    <header>
      <nav className="wrap">
        <a className="nav-logo" href="#top" aria-label="AYF Home">
          <img src="/AYF_logo_clean.png" alt="AYF" style={{ height: 40, width: 'auto' }} />
        </a>
        <ul className="nav-links" id="navLinks">
          <li><a className="active" href="#top">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="hide-mobile">
          <a className="btn btn-solid" href="/register?type=competition">Register</a>
        </div>
        <button className="hamburger" aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
    </header>
  );
}
