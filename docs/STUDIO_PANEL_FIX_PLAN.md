# Studio Panel Fix/Enhancement Plan

## Problem Analysis

The Studio Panel should display:
1. **Feature Cards Grid**: Options to CREATE new content types (Video Overview, Infographic, etc.)
2. **Generated Content List**: Shows ONLY the content items (projects) that have been created FOR THE CURRENT CHAT

Current issues:
- Source count is hardcoded to 1
- Need to ensure `chatId` is always passed when creating projects
- Need to calculate actual source count from chat messages
- Need to handle cases where chatId might not be available

## Implementation Plan

### Phase 1: Source Count Calculation

**1.1 Create API endpoint to get chat source count**
- **File**: `app/api/chats/[chatId]/sources/route.ts`
- **Purpose**: Count unique sources from chat messages
- **Implementation**:
  - Query messages for the chat
  - Extract all `source-url` parts from assistant messages
  - Count unique URLs
  - Return count

**1.2 Create utility function for source extraction**
- **File**: `lib/studio/utils/source-counter.ts`
- **Purpose**: Reusable function to count sources from messages
- **Implementation**:
  - Extract source-url parts from UIMessage array
  - Deduplicate URLs
  - Return count

### Phase 2: Studio Panel Enhancements

**2.1 Update StudioOverviewPanel component**
- **File**: `components/studio/studio-overview-panel.tsx`
- **Changes**:
  - Fetch actual source count from API
  - Ensure `chatId` is required (show message if not available)
  - Only show projects for current chat (already implemented, verify)
  - Handle loading states properly
  - Show empty state when no projects exist

**2.2 Update project creation flow**
- **File**: `components/studio/studio-overview-panel.tsx`
- **Changes**:
  - Ensure `chatId` is always passed when creating projects
  - Show error if `chatId` is not available
  - Refresh project list after creation

**2.3 Add source count to project list items**
- **File**: `components/studio/studio-overview-panel.tsx`
- **Changes**:
  - Fetch source count for each project's chat
  - Display actual count instead of hardcoded value
  - Cache source count to avoid repeated API calls

### Phase 3: API Enhancements

**3.1 Update projects API to include source count**
- **File**: `app/api/studio/projects/route.ts`
- **Changes**:
  - Optionally include source count in project response
  - Use includeSources query parameter

**3.2 Create chat sources API**
- **File**: `app/api/chats/[chatId]/sources/route.ts` (NEW)
- **Implementation**:
  - GET endpoint to return source count
  - Query messages from database
  - Extract and count unique sources
  - Return JSON: `{ count: number, sources: string[] }`

### Phase 4: Data Layer Updates

**4.1 Create source counter utility**
- **File**: `lib/studio/utils/source-counter.ts` (NEW)
- **Functions**:
  - `countSourcesFromMessages(messages: UIMessage[]): number`
  - `extractUniqueSources(messages: UIMessage[]): string[]`

**4.2 Update project service (if needed)**
- **File**: `lib/studio/services/project-service.ts`
- **Changes**:
  - Ensure chatId validation
  - Add helper to get source count for a project's chat

### Phase 5: UI/UX Improvements

**5.1 Empty state handling**
- **File**: `components/studio/studio-overview-panel.tsx`
- **Changes**:
  - Show helpful message when no projects exist
  - Show message when chatId is not available
  - Add loading skeleton for source count

**5.2 Error handling**
- **File**: `components/studio/studio-overview-panel.tsx`
- **Changes**:
  - Handle API errors gracefully
  - Show error messages for failed operations
  - Retry logic for failed requests

## File Structure

```
app/
├── api/
│   ├── chats/
│   │   └── [chatId]/
│   │       └── sources/
│   │           └── route.ts          # NEW: Get source count for chat
│   └── studio/
│       └── projects/
│           └── route.ts               # UPDATE: Optionally include source count

lib/
├── studio/
│   ├── utils/
│   │   ├── source-counter.ts          # NEW: Source counting utilities
│   │   └── chat-context-extractor.ts  # EXISTS: Already has source extraction
│   └── services/
│       └── project-service.ts         # UPDATE: Add source count helper

components/
└── studio/
    └── studio-overview-panel.tsx      # UPDATE: Fix source count, ensure chatId
```

## Implementation Details

### 1. Source Count API (`app/api/chats/[chatId]/sources/route.ts`)

```typescript
export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  // Authenticate user
  // Get chatId from params
  // Query messages for chat
  // Extract source-url parts
  // Count unique sources
  // Return { count: number, sources: string[] }
}
```

### 2. Source Counter Utility (`lib/studio/utils/source-counter.ts`)

```typescript
export function countSourcesFromMessages(messages: UIMessage[]): number {
  // Extract all source-url parts
  // Deduplicate URLs
  // Return count
}

export function extractUniqueSources(messages: UIMessage[]): string[] {
  // Extract all source-url parts
  // Deduplicate URLs
  // Return array of unique URLs
}
```

### 3. Updated StudioOverviewPanel

Key changes:
- Fetch source count when chatId is available
- Require chatId for project creation
- Show proper empty states
- Handle loading and error states
- Refresh project list after creation

## Testing Checklist

- [ ] Source count API returns correct count
- [ ] Source count displays correctly in project list
- [ ] Projects are filtered by chatId correctly
- [ ] Project creation requires chatId
- [ ] Empty state shows when no projects exist
- [ ] Error handling works for missing chatId
- [ ] Loading states display correctly
- [ ] Project list refreshes after creation

## Migration Notes

- No database migrations needed
- No breaking changes to existing APIs
- Backward compatible (chatId is optional in schema)

## Success Criteria

1. Studio Panel shows only projects for current chat
2. Source count is accurate and fetched from chat messages
3. Project creation always links to current chat
4. Empty states and error handling work properly
5. UI matches the design in the provided image

