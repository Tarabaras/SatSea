'use client';

import Link from 'next/link';
import { useState } from 'react';
import WalletConnectButton from '@/components/wallet/WalletConnectButton';

const CATEGORIES = ['All', 'Art', 'Gaming', 'PFPs', 'Photography', 'Music'];

export default function Navbar() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-os-bg/95 backdrop-blur-xl border-b border-os-border">
            <div className="flex items-center h-[72px] px-4 lg:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 mr-6 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-os-orange to-orange-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="text-lg font-bold text-os-text hidden md:block">SatSea</span>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-xl relative mx-4">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-os-text-muted" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search NFTs, collections..."
                        className="w-full bg-os-card border border-os-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-os-text placeholder-os-text-muted focus:outline-none focus:border-os-border-light transition-colors"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <kbd className="text-[10px] text-os-text-muted border border-os-border rounded px-1.5 py-0.5 font-mono">/</kbd>
                    </div>
                </div>

                {/* Category Tabs (desktop) */}
                <div className="hidden lg:flex items-center gap-1 mr-4">
                    {CATEGORIES.slice(0, 4).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                activeCategory === cat
                                    ? 'bg-os-card text-os-text'
                                    : 'text-os-text-secondary hover:text-os-text hover:bg-os-card/50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 ml-auto shrink-0">
                    <Link
                        href="/create"
                        className="hidden md:flex items-center gap-2 text-sm font-semibold text-os-text-secondary hover:text-os-text transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create
                    </Link>
                    <WalletConnectButton />
                </div>
            </div>
        </nav>
    );
}
