import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

const ViewClientFeedbackModal = ({ feedback, open, onOpenChange }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.25) return "bg-green-100 text-green-700 border-green-200";
    if (rating >= 3.75) return "bg-cyan-100 text-cyan-700 border-cyan-200";
    if (rating >= 3.0) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (rating >= 2.0) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getRatingStarColor = (rating) => {
    if (rating >= 4.25) return "text-green-500";
    if (rating >= 3.75) return "text-cyan-500";
    if (rating >= 3.0) return "text-yellow-500";
    if (rating >= 2.0) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client Feedback Details</DialogTitle>
          <DialogDescription>
            Complete review from {feedback?.client?.first_name}{" "}
            {feedback?.client?.last_name}
          </DialogDescription>
        </DialogHeader>

        {feedback && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  CLIENT
                </p>
                <p className="font-semibold text-sm">
                  {feedback.client?.first_name} {feedback.client?.last_name}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  TICKET CODE
                </p>
                <p className="font-semibold text-sm">
                  {feedback.ticket?.ticket_code}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  DEPARTMENT
                </p>
                <p className="text-sm capitalize">
                  {feedback.ticket?.service?.department?.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  SERVICE
                </p>
                <p className="text-sm capitalize">
                  {feedback.ticket?.service?.name}
                </p>
              </div>
            </div>

            {/* Overall Rating - Prominent */}
            <div className="flex items-end gap-4 bg-muted/30 p-4 rounded-lg">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  OVERALL EXPERIENCE
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-bold ${getRatingStarColor(
                      feedback.overall_rating
                    )}`}
                  >
                    {Number.parseFloat(feedback.overall_rating).toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
              </div>
              <div className="ml-auto flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= feedback.overall_rating
                        ? `fill-current ${getRatingStarColor(
                            feedback.overall_rating
                          )}`
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Client Feedback Comment */}
            {feedback.comment && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  FEEDBACK
                </p>
                <div
                  className="bg-white border rounded-md p-3 sm:p-4 text-sm text-gray-700 leading-relaxed min-h-[40px] sm:min-h-[25px] shadow-sm"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {feedback.comment}
                </div>
              </div>
            )}

            {/* Detailed Ratings */}
            {feedback.dimensionRatings &&
              feedback.dimensionRatings.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    DETAILED RATINGS
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {/* sort alphabetically */}
                    {feedback.dimensionRatings
                      .slice()
                      .sort((a, b) =>
                        a.dimension.dimension_name.localeCompare(
                          b.dimension.dimension_name
                        )
                      )
                      .map((dimension) => (
                        <div
                          key={dimension.dimension_rating_id}
                          className={`p-3 rounded-lg border ${getRatingColor(
                            dimension.rating_value
                          )} transition-all`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">
                              {Number.parseFloat(
                                dimension.rating_value
                              ).toFixed(1)}
                              /5.0
                            </span>
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <p className="text-sm font-medium line-clamp-2">
                            {dimension.dimension.dimension_name}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Footer - Minimal */}
            <div className="flex justify-end pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// const ViewClientFeedbackModal = ({ feedback, open, onOpenChange }) => {
//   const getRatingColor = (rating) => {
//     if (rating >= 4.25) return "text-green-600";
//     if (rating >= 3.75) return "text-cyan-600";
//     if (rating >= 3.0) return "text-yellow-600";
//     if (rating >= 2.0) return "text-orange-600";
//     return "text-red-600";
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             Client Feedback Details
//           </DialogTitle>
//           <DialogDescription>
//             Complete review of client experience
//           </DialogDescription>
//         </DialogHeader>

//         {feedback && (
//           <div className="space-y-6">
//             {/* Client & Service Information */}
//             <div className="space-y-4">
//               <div className="flex items-start gap-3">
//                 <div className="flex-1 flex justify-between">
//                   <div className="flex items-center gap-2 mt-1">
//                     <User className="h-5 w-5" />
//                     <h3 className="font-semibold text-lg">
//                       {feedback.client?.first_name} {feedback.client?.last_name}
//                     </h3>
//                   </div>
//                   <div className="flex items-center gap-2 mt-1">
//                     <Ticket className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm text-muted-foreground">
//                       Ticket:{" "}
//                       <span className="font-medium">
//                         {feedback.ticket?.ticket_code}
//                       </span>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Building className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm font-medium">Department</span>
//                   </div>
//                   <p className="text-sm truncate capitalize">
//                     {feedback.ticket?.service?.department?.name}
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <Layers className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm font-medium">Service</span>
//                   </div>
//                   <p className="text-sm truncate capitalize">
//                     {feedback.ticket?.service?.name}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Client Comment */}
//             {feedback.comment && (
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <h4 className="font-medium">Client's Feedback</h4>
//                 </div>
//                 <div
//                   className="bg-white border rounded-md p-4 text-sm text-gray-700 leading-relaxed min-h-[40px] shadow-sm"
//                   style={{
//                     wordBreak: "break-word",
//                     overflowWrap: "break-word",
//                   }}
//                 >
//                   <p className="text-gray-700 leading-relaxed">
//                     {feedback.comment}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Overall Rating Summary */}
//             <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <h4 className="font-medium">Overall Experience</h4>
//                 </div>
//                 <div className="flex items-baseline gap-1">
//                   <span
//                     className={`font-bold text-3xl ${getRatingColor(
//                       feedback.overall_rating
//                     )}`}
//                   >
//                     {parseFloat(feedback.overall_rating).toFixed(1)}
//                   </span>
//                   <span className="text-sm text-muted-foreground">/ 5.0</span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <h4 className="font-medium">Detailed Ratings</h4>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {feedback.dimensionRatings?.map((dimension) => {
//                   const ratingColor = getRatingColor(dimension.rating_value);
//                   return (
//                     <div
//                       key={dimension.dimension_rating_id}
//                       className="flex flex-col p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <Badge
//                           className={`${ratingColor} text-sm font-semibold bg-inherit border-primary border capitalize`}
//                         >
//                           {dimension.rating_value}/5
//                         </Badge>
//                         <div className="flex gap-1">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star
//                               key={star}
//                               className={`h-5 w-5 ${
//                                 star <= dimension.rating_value
//                                   ? "fill-yellow-400 text-yellow-400"
//                                   : "fill-gray-200 text-gray-200"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="space-y-1">
//                         <h5 className="font-medium text-md truncate">
//                           {dimension.dimension.dimension_name}
//                         </h5>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex justify-end pt-4 border-t">
//               <Button variant="outline" onClick={() => onOpenChange(false)}>
//                 Close Review
//               </Button>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

export default ViewClientFeedbackModal;
