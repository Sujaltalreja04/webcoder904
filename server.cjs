const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

// Store ideas in memory (in a real app, you'd use a database)
let ideas = [
  {
    id: '1',
    title: 'AI-Powered Code Review Tool',
    description: 'A tool that uses AI to automatically review code and suggest improvements based on best practices.',
    author: 'Alex Johnson',
    votes: 12,
    comments: [
      {
        id: 'c1',
        author: 'Sam Wilson',
        content: 'This would be incredibly useful for teams! Would love to see it support multiple languages.',
        createdAt: new Date(Date.now() - 86400000),
      }
    ],
    createdAt: new Date(Date.now() - 172800000),
    tags: ['AI', 'Code Quality', 'Dev Tools']
  },
  {
    id: '2',
    title: '3D Data Visualization Dashboard',
    description: 'Interactive 3D dashboard for visualizing complex datasets with immersive exploration capabilities.',
    author: 'Maria Garcia',
    votes: 8,
    comments: [],
    createdAt: new Date(Date.now() - 259200000),
    tags: ['3D', 'Data Viz', 'React']
  }
];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send initial ideas to the client
  socket.emit('ideasUpdated', ideas);

  // Handle requests for all ideas
  socket.on('getIdeas', () => {
    socket.emit('ideasUpdated', ideas);
  });

  // Handle new idea submissions
  socket.on('addIdea', (newIdea) => {
    ideas.unshift(newIdea);
    io.emit('ideaAdded', newIdea);
  });

  // Handle voting on ideas
  socket.on('voteIdea', (ideaId) => {
    const idea = ideas.find(idea => idea.id === ideaId);
    if (idea) {
      idea.votes += 1;
      io.emit('ideaVoted', ideaId, idea.votes);
    }
  });

  // Handle adding comments
  socket.on('addComment', (ideaId, newComment) => {
    const idea = ideas.find(idea => idea.id === ideaId);
    if (idea) {
      idea.comments.push(newComment);
      io.emit('commentAdded', ideaId, newComment);
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});