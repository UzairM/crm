import { useNavigation } from '../../hooks/inbox/useNavigation'
import { useConversation } from '../../hooks/inbox/useConversation'
import { useResizePanel } from '../../hooks/inbox/useResizePanel'
import { NavigationSidebar } from '../../components/inbox/NavigationSidebar'
import { ConversationList } from '../../components/inbox/ConversationList'
import { MessengerView } from '../../components/inbox/MessengerView'
import { DetailsPanel } from '../../components/inbox/DetailsPanel'
import { ResizeHandle } from '../../components/inbox/ResizeHandle'
import { demoConversations } from '../../data/inbox'

export default function InboxPage() {
  const { isNavExpanded, toggleNav, isInbox } = useNavigation()
  const {
    selectedConversation,
    setSelectedConversation,
    filter,
    sortBy,
    handleFilterChange,
    handleSortChange
  } = useConversation()
  const { width: detailsWidth, handleMouseDown, handleKeyDown } = useResizePanel()

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col pt-6">
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Navigation & Conversation List Card */}
        <div className="flex bg-card rounded-lg border border-border shadow-sm h-full">
          <NavigationSidebar isExpanded={isNavExpanded} />
          <ConversationList
            isNavExpanded={isNavExpanded}
            toggleNav={toggleNav}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            filter={filter}
            sortBy={sortBy}
            handleFilterChange={handleFilterChange}
            handleSortChange={handleSortChange}
            isInbox={isInbox}
            conversations={demoConversations}
          />
        </div>

        {/* Messenger View */}
        <MessengerView
          selectedConversation={selectedConversation}
          isInbox={isInbox}
        />

        {/* Resize Handle */}
        <ResizeHandle
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
        />

        {/* Details Panel */}
        <DetailsPanel width={detailsWidth} />
      </div>
    </div>
  )
} 

