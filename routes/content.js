const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all content (blog posts, resources, etc.)
// @route   GET /api/content
// @access  Public
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('type').optional().isIn(['blog', 'resource', 'news']).withMessage('Invalid content type'),
    query('category').optional().isString().withMessage('Category must be a string'),
    query('search').optional().isString().withMessage('Search must be a string')
], optionalAuth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // For now, return mock data. In a real implementation, you would have a Content model
        const mockContent = [
            {
                _id: '1',
                title: 'Getting Started with AI Development',
                type: 'blog',
                category: 'AI',
                author: {
                    name: 'Dr. Sarah Chen',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
                },
                excerpt: 'Learn the fundamentals of AI development and how to build your first intelligent application.',
                content: 'Full blog content here...',
                coverImage: '/images/ai-blog-cover.jpg',
                tags: ['AI', 'Development', 'Machine Learning'],
                publishedAt: new Date('2025-01-15'),
                readTime: '8 min read',
                views: 1250,
                likes: 45,
                comments: 12
            },
            {
                _id: '2',
                title: 'Community Guidelines and Best Practices',
                type: 'resource',
                category: 'Community',
                author: {
                    name: 'Community Team',
                    avatar: '/logo.jpeg'
                },
                excerpt: 'Essential guidelines for participating in our community and making the most of your experience.',
                content: 'Resource content here...',
                coverImage: '/images/community-guidelines.jpg',
                tags: ['Community', 'Guidelines', 'Best Practices'],
                publishedAt: new Date('2025-01-10'),
                readTime: '5 min read',
                views: 890,
                likes: 32,
                comments: 8
            }
        ];

        res.json({
            success: true,
            data: {
                content: mockContent,
                pagination: {
                    current: 1,
                    pages: 1,
                    total: mockContent.length,
                    hasNext: false,
                    hasPrev: false
                }
            }
        });
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching content'
        });
    }
});

// @desc    Get single content item
// @route   GET /api/content/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        // Mock content item
        const content = {
            _id: req.params.id,
            title: 'Getting Started with AI Development',
            type: 'blog',
            category: 'AI',
            author: {
                name: 'Dr. Sarah Chen',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                bio: 'AI Research Lead at Stanford University'
            },
            content: `
        <h2>Introduction to AI Development</h2>
        <p>Artificial Intelligence is revolutionizing the way we build applications...</p>
        
        <h3>Key Concepts</h3>
        <ul>
          <li>Machine Learning Fundamentals</li>
          <li>Neural Networks</li>
          <li>Deep Learning</li>
          <li>Natural Language Processing</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>To begin your AI development journey, you'll need to understand the basics...</p>
      `,
            coverImage: '/images/ai-blog-cover.jpg',
            tags: ['AI', 'Development', 'Machine Learning'],
            publishedAt: new Date('2025-01-15'),
            readTime: '8 min read',
            views: 1250,
            likes: 45,
            comments: 12,
            relatedContent: [
                {
                    _id: '2',
                    title: 'Advanced Machine Learning Techniques',
                    type: 'blog',
                    coverImage: '/images/ml-advanced.jpg',
                    readTime: '12 min read'
                }
            ]
        };

        res.json({
            success: true,
            data: { content }
        });
    } catch (error) {
        console.error('Get content item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching content'
        });
    }
});

// @desc    Create new content
// @route   POST /api/content
// @access  Private
router.post('/', protect, [
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('type').isIn(['blog', 'resource', 'news']).withMessage('Invalid content type'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('content').trim().isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
    body('excerpt').optional().trim().isLength({ max: 500 }).withMessage('Excerpt cannot be more than 500 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // In a real implementation, you would create a Content model and save to database
        const content = {
            _id: Date.now().toString(),
            ...req.body,
            author: {
                _id: req.user._id,
                name: req.user.name,
                avatar: req.user.avatar
            },
            publishedAt: new Date(),
            views: 0,
            likes: 0,
            comments: 0,
            status: 'published'
        };

        res.status(201).json({
            success: true,
            message: 'Content created successfully',
            data: { content }
        });
    } catch (error) {
        console.error('Create content error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating content'
        });
    }
});

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private
router.put('/:id', protect, [
    body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('type').optional().isIn(['blog', 'resource', 'news']).withMessage('Invalid content type'),
    body('category').optional().trim().notEmpty().withMessage('Category is required'),
    body('content').optional().trim().isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
    body('excerpt').optional().trim().isLength({ max: 500 }).withMessage('Excerpt cannot be more than 500 characters'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // In a real implementation, you would update the content in the database
        const content = {
            _id: req.params.id,
            ...req.body,
            updatedAt: new Date()
        };

        res.json({
            success: true,
            message: 'Content updated successfully',
            data: { content }
        });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating content'
        });
    }
});

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        // In a real implementation, you would delete the content from the database
        res.json({
            success: true,
            message: 'Content deleted successfully'
        });
    } catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting content'
        });
    }
});

// @desc    Like content
// @route   POST /api/content/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        // In a real implementation, you would handle liking/unliking content
        res.json({
            success: true,
            message: 'Content liked successfully'
        });
    } catch (error) {
        console.error('Like content error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while liking content'
        });
    }
});

// @desc    Get content categories
// @route   GET /api/content/categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = [
            { name: 'AI & Machine Learning', count: 15, slug: 'ai-ml' },
            { name: 'Web Development', count: 23, slug: 'web-dev' },
            { name: 'Data Science', count: 12, slug: 'data-science' },
            { name: 'Community', count: 8, slug: 'community' },
            { name: 'Events', count: 5, slug: 'events' },
            { name: 'Tutorials', count: 18, slug: 'tutorials' }
        ];

        res.json({
            success: true,
            data: { categories }
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories'
        });
    }
});

module.exports = router;
