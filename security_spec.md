# Melkban Security Specification & Hardening Guidelines

## 1. Data Invariants
- Each Property must be mapped to a unique ID matching alphabetical, numerical, and hyphen character constraints.
- Properties must contain non-empty visual descriptions, positive land areas, valid numeric coordinates (latitude, longitude), and complete contact details (phone, physical address).
- ChatMessages must refer to active properties, containing restricted string limits (text less than 5000 characters) to prevent Denial of Wallet payload saturation attacks.

## 2. The "Dirty Dozen" Payloads
These offensive payloads are specifically designed to attempt to bypass standard validation rules. Security checks must block them:

1. **ID Poisoning Attack (Property)**: Attempt ID injection with long junk strings containing slashes or wildcards.
2. **Negative Land Area (Property)**: Sending negative values for area (`"area": -50`).
3. **Huge Title Saturation (Property)**: Bypassing size restrictions with a 20KB title string.
4. **Invalid Contract Enum (Property)**: Setting contract status to an unapproved state (`"type": "auction"`).
5. **PII Injection (Property)**: Hijacking phone formats with excessively large text.
6. **Null Coordinate Attack (Property)**: Supplying a null or missing coordinate mapping to cause system exceptions when rendering.
7. **Junk Field Pollution (Property)**: Passing third-party unvalidated variables (`"ghost_field": "unapproved_bypass"`).
8. **Chat Character Squeeze (ChatMsg)**: Sending 1MB of text in a message.
9. **Chat ID Spoofing (ChatMsg)**: Trying to inject invalid symbols in ID paths.
10. **Chat Cross-reference Bypass (ChatMsg)**: Sending messages referring to nonexistent property IDs.
11. **Immutability Hijack (Property)**: Trying to rewrite system-only attributes (`"isApproved": true`) from client-side direct writes.
12. **Malicious Protocol Injection (Property)**: Passing HTML or executable script segments in descriptions.

## 3. Test Runner Pattern
Test queries verified via regular server-side verification: all unauthorized, poorly structured, or manipulated inputs must be strictly blocked and throw robust permission denials.
