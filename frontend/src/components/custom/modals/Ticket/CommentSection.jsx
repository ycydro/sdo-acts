import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, ChevronDown, MessageSquare, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCommentMutation } from "@/hooks/queries/ticket/comments/useCommentMutations";
import { useComments } from "@/hooks/queries/ticket/comments/useComments";

export const CommentSection = ({ ticketID, ticketStatus }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allComments, setAllComments] = useState([]);
  const [pagination, setPagination] = useState(null);

  // Fetch comments for current page using useComments hook
  const {
    data: commentsData,
    isLoading,
    isError,
  } = useComments(ticketID, currentPage);

  const { createComment, isCreating } = useCommentMutation();

  // Extract comments and pagination from nested response
  const commentsFromResponse = commentsData?.data?.comments || [];
  const paginationFromResponse = commentsData?.data?.pagination || null;

  useEffect(() => {
    if (commentsData?.data) {
      if (currentPage === 1) {
        // First page, replace all comments
        setAllComments(commentsFromResponse);
      } else {
        // dagdag lang new comments to existing ones
        setAllComments((prev) => [...prev, ...commentsFromResponse]);
      }
      setPagination(paginationFromResponse);
    }
  }, [commentsData, currentPage, commentsFromResponse, paginationFromResponse]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !ticketID) return;

    try {
      await createComment.mutateAsync({
        ticketID: ticketID,
        content: newComment.trim(),
      });
      setNewComment("");
      // Reset to page 1 to see the new comment
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleLoadMore = () => {
    if (pagination && pagination.hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleShowLess = () => {
    // Reset to first page with only first set of comments
    setCurrentPage(1);
    if (commentsData?.data?.comments) {
      setAllComments(commentsData.data.comments);
    }
  };

  if (isError) {
    return (
      <Card className="shadow-sm border">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Failed to load comments. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && currentPage === 1 && allComments.length === 0) {
    return (
      <Card className="shadow-sm border">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalComments = pagination?.totalComments || 0;
  const showingComments = allComments.length;
  const hasMore = pagination?.hasMore || false;

  return (
    <Card className="shadow-sm border">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Header with comment count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-base sm:text-lg lg:text-xl">
                Comments {totalComments > 0 && `(${totalComments})`}
              </h3>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3 sm:space-y-4">
            {allComments.length === 0 ? (
              <div className="text-center py-1 text-gray-500">
                No comments yet.
              </div>
            ) : (
              <>
                {allComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex gap-2 sm:gap-3 ${
                      comment.user?.id === user?.id ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar
                      className={`w-7 h-7 sm:w-8 sm:h-8 ${
                        comment.user?.id === user?.id ? "order-2" : ""
                      }`}
                    >
                      <AvatarFallback
                        className={
                          comment.user?.role.name === "Staff" ||
                          comment.user?.role.name === "Superadmin"
                            ? "bg-blue-100 text-blue-800 text-xs sm:text-sm"
                            : "bg-green-100 text-green-800 text-xs sm:text-sm"
                        }
                      >
                        {comment.user?.first_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex-1 max-w-[calc(100%-2.5rem)] sm:max-w-none ${
                        comment.user?.id === user?.id ? "items-end" : ""
                      }`}
                    >
                      <div
                        className={`p-2 sm:p-3 rounded-lg ${
                          comment.user?.id === user?.id
                            ? "bg-blue-50 border border-blue-100"
                            : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <span className="font-medium text-xs sm:text-sm truncate">
                              {`${comment.user?.first_name || ""} ${
                                comment.user?.last_name || ""
                              }`.trim() || "Unknown User"}
                            </span>
                            {/* If you want to show department badge */}
                            {comment.user?.department_id && (
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs px-1 py-0 h-4 sm:h-5"
                              >
                                Staff
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2">
                            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                              {formatDistanceToNow(
                                new Date(
                                  comment.timestamp || comment.createdAt,
                                ),
                                {
                                  addSuffix: true,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading More Indicator */}
                {isLoading && currentPage > 1 && (
                  <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                      <span className="text-sm">Loading more comments...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Load More / Show Less Buttons */}
          {(hasMore || currentPage > 1) && (
            <div className="flex flex-col items-center gap-2 pt-2">
              {hasMore && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <ChevronDown className="h-4 w-4" />
                  Load More Comments
                  {!isLoading && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({showingComments} of {totalComments})
                    </span>
                  )}
                </Button>
              )}

              {currentPage > 1 && !hasMore && (
                <div className="text-center text-sm text-gray-500">
                  Showing all {totalComments} comments
                </div>
              )}

              {currentPage > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowLess}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Show fewer comments
                </Button>
              )}
            </div>
          )}

          {/* Add Comment Form */}
          <div className="space-y-2 sm:space-y-3 border-t pt-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                <AvatarFallback
                  className={
                    user?.role === "staff" || user?.role === "admin"
                      ? "bg-blue-100 text-blue-800 text-xs sm:text-sm"
                      : "bg-green-100 text-green-800 text-xs sm:text-sm"
                  }
                >
                  {user?.first_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5 sm:space-y-2">
                <Textarea
                  placeholder={
                    ["Resolved", "Declined"].includes(ticketStatus)
                      ? "Comments are disabled"
                      : "Type your comment here..."
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[50px] sm:min-h-[65px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  disabled={
                    isCreating ||
                    ["Resolved", "Declined"].includes(ticketStatus)
                  }
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="hidden lg:inline text-[10px] sm:text-xs text-muted-foreground order-2 sm:order-1">
                    Press Ctrl+Enter to send
                  </p>
                  <Button
                    onClick={handleAddComment}
                    disabled={
                      !newComment.trim() ||
                      isCreating ||
                      ticketStatus === "Resolved"
                    }
                    className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm order-1 sm:order-2"
                    size="sm"
                  >
                    {isCreating ? (
                      <>
                        <span className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </>
                    ) : ticketStatus === "Resolved" ? (
                      <>
                        <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                        Disabled
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
