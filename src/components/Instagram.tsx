'use client';

import Image from 'next/image';
import { instagramPosts, InstagramPost } from '@/data/instagramPosts';

function InstagramCard({ post, index }: { post: InstagramPost; index: number }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="insta-premium-card reveal"
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="insta-img-container">
        <Image
          src={post.image}
          alt={`AYF 2026 Instagram post by @${post.username || 'amravatiyouthfest'}`}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 980px) 45vw, 30vw"
          className="insta-img"
          priority={index === 0}
        />
        <div className="insta-gradient-overlay" />
        <div className="insta-card-content">
          {post.date && <span className="insta-date">{post.date}</span>}
          <p className="insta-caption">{post.caption}</p>
          <div className="insta-card-footer">
            <div className="insta-user">
              {/* Instagram SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="insta-icon"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span className="insta-username">@{post.username || 'amravatiyouthfest'}</span>
            </div>
            <div className="insta-view">
              <span>View on Instagram</span>
              {/* Arrow Right SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="insta-arrow"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function InstagramGrid() {
  return (
    <div className="insta-grid-container">
      {instagramPosts.map((post, i) => (
        <InstagramCard key={post.id} post={post} index={i} />
      ))}
    </div>
  );
}

export default function Instagram() {
  return (
    <section className="insta" id="social">
      <div className="wrap">
        <div className="insta-header-wrap reveal">
          <span className="insta-eyebrow">Social</span>
          <h2 className="insta-title">Follow the AYF Journey</h2>
          <p className="insta-subtitle">
            See the latest announcements, behind-the-scenes moments, competition updates, and festival highlights from our Instagram.
          </p>
        </div>

        <InstagramGrid />

        <div className="insta-cta-container reveal">
          <a
            href="https://www.instagram.com/amravatiyouthfest/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline insta-cta-btn"
          >
            Follow @amravatiyouthfest
          </a>
        </div>
      </div>
    </section>
  );
}
