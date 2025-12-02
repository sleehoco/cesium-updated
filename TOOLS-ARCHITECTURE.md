# Tools Page Architecture

## Overview
The CesiumCyber tools page is designed to be highly scalable and support multiple AI-powered security tools organized by categories.

## Structure

### Configuration File
**Location:** `src/config/tools-config.ts`

This file contains all tool definitions and categories. It's designed to easily add new tools without modifying the UI code.

### Tool Interface
```typescript
export interface Tool {
    id: string;                          // Unique identifier
    name: string;                        // Display name
    tagline: string;                     // Short description
    description: string;                 // Full description
    icon: LucideIcon;                    // Icon component
    category: string;                    // Category name
    path: string;                        // Route path
    features: string[];                  // List of key features
    status?: 'new' | 'beta' | 'coming-soon';  // Optional status badge
    color: string;                       // Tailwind color class
}
```

### Categories
The system supports multiple categories. Currently configured:
- **Threat Intelligence** - IOC analysis and threat detection
- **AI Security Tools** - AI-powered security analysis tools (NEW)
- **Vulnerability Assessment** - Security scanning and assessment
- **Incident Response** - Incident handling and response
- **Security Analysis** - Log analysis and forensics
- **Compliance** - Compliance checking and auditing

## Adding New Tools

### Step 1: Import Required Icons
```typescript
import { YourIcon } from 'lucide-react';
```

### Step 2: Add Tool to Configuration
Add a new tool object to the `tools` array:

```typescript
{
    id: 'unique-tool-id',
    name: 'Tool Name',
    tagline: 'Short Tagline',
    description: 'Full description of what this tool does...',
    icon: YourIcon,
    category: 'AI Security Tools',  // Must match existing category
    path: '/tools/your-tool-path',
    features: [
        'Feature 1',
        'Feature 2',
        'Feature 3',
        'Feature 4',
    ],
    status: 'coming-soon',  // Optional: 'new', 'beta', or 'coming-soon'
    color: 'blue-500',      // Tailwind color
}
```

### Step 3: Create Tool Page
Create the actual tool page at the specified path:
- Location: `src/app/tools/[your-tool-path]/page.tsx`
- Implement the tool functionality
- Follow existing patterns for consistency

## Current AI Tools

### Live Tools
1. **Threat Intelligence Analyzer** (`/tools/threat-intel`)
   - Status: Active
   - Multi-provider AI integration (Groq, Together.ai, OpenAI)
   - VirusTotal API integration
   - Real-time IOC analysis

### Planned AI Tools (Coming Soon)
1. **Security Advisor** - AI security consultation
2. **AI Threat Hunter** - ML-based threat detection
3. **AI Code Security Scanner** - Source code vulnerability analysis
4. **AI Phishing Detector** - Email phishing analysis
5. **AI Network Analyzer** - Network traffic analysis

## Page Layout

The tools page (`src/app/tools/page.tsx`) automatically organizes tools by category:

```typescript
// Filters categories (excludes "All Tools" from display)
const categories = toolCategories.filter(cat => cat !== 'All Tools');

// Maps through each category
categories.map((category) => {
    const categoryTools = getToolsByCategory(category);
    // Renders category header and tool grid
})
```

### Category Display
Each category shows:
- Category header with accent line
- Grid of tool cards (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)
- Animated tool cards with hover effects

### Tool Card Features
- Icon with color theme
- Status badge (New, Beta, Coming Soon)
- Name and tagline
- Description
- Feature list
- Launch/Coming Soon button

## Scalability Features

### Multiple Tools Per Category
The architecture supports unlimited tools in each category:
- Automatically renders all tools in the category
- No hardcoded limits
- Dynamic grid layout

### Easy Category Management
Add new categories by:
1. Adding to `toolCategories` array
2. Assigning tools to the new category
3. Page automatically creates new section

### Provider-Agnostic AI Integration
AI tools use the multi-provider system:
- Groq (default)
- Together.ai (fallback)
- OpenAI (fallback)
- Automatic provider switching on failure

## Best Practices

### Adding AI Tools
1. **Use descriptive IDs**: `ai-threat-hunter` not `tool1`
2. **Clear taglines**: Focus on the AI capability
3. **Specific features**: List 4 concrete features
4. **Appropriate status**: Mark as `coming-soon` until implemented
5. **Color consistency**: Use Tailwind colors that match your theme

### Tool Implementation
1. **Create dedicated page**: Each tool gets its own route
2. **Follow patterns**: Use existing tools as templates
3. **Error handling**: Implement robust error handling
4. **Loading states**: Show loading indicators
5. **AI streaming**: Use streaming responses for better UX

### Performance
- Icons are tree-shaken (only imported icons are bundled)
- Tool cards are animated on scroll for better perceived performance
- Images/icons are optimized
- Lazy loading for tool pages

## Helper Functions

```typescript
// Get specific tool by ID
getToolById(id: string): Tool | undefined

// Get all tools in a category
getToolsByCategory(category: string): Tool[]
```

## Future Enhancements

1. **Search/Filter**: Add search bar to filter tools
2. **Tool Tags**: Add tags for cross-category filtering
3. **Analytics**: Track tool usage
4. **Favorites**: Let users mark favorite tools
5. **API Integration**: Real-time tool status updates
6. **User Permissions**: Role-based tool access

## Example: Adding a New AI Tool

```typescript
// In tools-config.ts
import { Fingerprint } from 'lucide-react';

{
    id: 'ai-malware-analyzer',
    name: 'AI Malware Analyzer',
    tagline: 'Deep Learning Malware Detection',
    description: 'Advanced malware analysis using deep learning models. Analyze suspicious files, detect malware families, and get behavioral analysis reports.',
    icon: Fingerprint,
    category: 'AI Security Tools',
    path: '/tools/ai-malware-analyzer',
    features: [
        'Deep learning detection',
        'Behavioral analysis',
        'Malware family classification',
        'Sandbox integration',
    ],
    status: 'beta',
    color: 'rose-500',
}
```

Then create: `src/app/tools/ai-malware-analyzer/page.tsx`

The tool will automatically appear in the "AI Security Tools" category on the tools page!
