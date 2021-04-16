import React from "react";
import { useSelector } from "react-redux";
import { commentThreadsSelector } from "../../selectors/commentsSelectors";
import CommentCard from "../CommentCard/CommentCard";

type Props = {
  commentThreadIds: Array<string>;
};

// WIP: Implement thread view
const CommentThread = ({ commentThreadId }: { commentThreadId: string }) => {
  const commentThread = useSelector(commentThreadsSelector(commentThreadId));
  const { comments } = commentThread;

  if (!comments || comments.length === 0) return null;

  return <CommentCard comment={comments[0]} />;
};

const AppCommentsList = ({ commentThreadIds }: Props) => {
  return (
    <>
      {commentThreadIds.map((commentThreadId: string) => (
        <CommentThread
          key={commentThreadId}
          commentThreadId={commentThreadId}
        />
      ))}
    </>
  );
};

export default AppCommentsList;
