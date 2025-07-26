const adjectives = [
    'Mysterious', 'Anonymous', 'Curious', 'Adventurous', 'Playful',
    'Silent', 'Lonely', 'Happy', 'Silly', 'Crazy', 'Wild', 'Quiet',
    'Noisy', 'Bored', 'Sleepy', 'Hungry', 'Thirsty', 'Random',
    'Strange', 'Funny', 'Serious', 'Chill', 'Cool', 'Lucky', 'Brave',
    'Shy', 'Kind', 'Gentle', 'Rude', 'Polite', 'Smart', 'Clever',
    'Fast', 'Slow', 'Young', 'Old', 'Ancient', 'Modern', 'Future',
    'Past', 'Present', 'Digital', 'Analog', 'Virtual', 'Real'
];

const nouns = [
    'Stranger', 'Traveler', 'Explorer', 'Visitor', 'Guest',
    'Friend', 'Enemy', 'Alien', 'Human', 'Robot', 'Cat', 'Dog',
    'Bird', 'Fish', 'Tree', 'Flower', 'Mountain', 'River', 'Ocean',
    'Star', 'Moon', 'Sun', 'Cloud', 'Storm', 'Rain', 'Snow', 'Wind',
    'Fire', 'Earth', 'Water', 'Air', 'Spirit', 'Ghost', 'Angel',
    'Demon', 'Hero', 'Villain', 'Wizard', 'Witch', 'Knight', 'King',
    'Queen', 'Prince', 'Princess', 'Ninja', 'Pirate', 'Spy', 'Detective',
    'Artist', 'Musician', 'Dancer', 'Writer', 'Poet', 'Scientist'
];

const suffixes = [
    '123', '456', '789', '101', '202', '303', '404', '505', '606', '707',
    '808', '909', '000', '111', '222', '333', '444', '555', '666', '777',
    '888', '999', '42', '69', '99', '100', '200', '300', 'X', 'Y', 'Z',
    '007', '911', '999', 'XXX', 'LOL', 'OMG', 'WTF', 'FYI', 'BTW', 'IDK'
];

// Generate a random username
function generateUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = Math.random() > 0.7 ? '' :
        suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${adj}${noun}${suffix}`;
}

// // Generate multiple usernames
// function generateUsernames(count = 10) {
//   return Array.from({ length: count }, generateUsername);
// }

// // Example usage:
// console.log(generateUsername()); // e.g. "MysteriousStranger404"
// console.log(generateUsernames(5)); // e.g. ["HappyCat123", "SilentGhost", ...]

export { generateUsername };