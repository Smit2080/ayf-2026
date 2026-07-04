'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const onMenu = () => document.body.classList.toggle('mobile-menu-open');
    hamburger?.addEventListener('click', onMenu);

    const links = document.querySelectorAll('.nav-links a');
    const onLink = () => document.body.classList.remove('mobile-menu-open');
    links.forEach(l => l.addEventListener('click', onLink));

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => obs.observe(s));

    return () => {
      hamburger?.removeEventListener('click', onMenu);
      links.forEach(l => l.removeEventListener('click', onLink));
      obs.disconnect();
    };
  }, []);

  return (
    <header>
      <nav className="wrap">
        <Link className="nav-logo" href="/" aria-label="AYF Home">
          <img src="/AYF_logo_clean.png" alt="AYF" style={{ height: 40, width: 'auto' }} />
        </Link>
        <ul className="nav-links" id="navLinks">
          <li><a className="active" href="/">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="hide-mobile">
          <Link className="btn btn-solid" href="/register?type=competition">Register</Link>
        </div>
        <button className="hamburger" aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
    </header>
  );
}
