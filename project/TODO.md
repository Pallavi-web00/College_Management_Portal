# Leave Workflow Implementation TODO

1. [x] types.ts - Add `hodStatus` and `hodRemarks` fields to `ApprovalRequest`
2. [x] menus.tsx - Add "Apply for Leave" menu item to all roles
3. [x] SharedViews.tsx - Create `LeaveManagementView` component (apply form, my requests, review queue)
4. [x] TeachingDashboard.tsx - Route `apply-leave` to `LeaveManagementView`
5. [x] NonTeachingDashboard.tsx - Route `apply-leave` to `LeaveManagementView`
6. [x] HodDashboard.tsx - Route `apply-leave` to `LeaveManagementView`
7. [x] DeanDashboard.tsx - Route `apply-leave` to `LeaveManagementView`
8. [x] PrincipalDashboard.tsx - Route `apply-leave` to `LeaveManagementView`
9. [x] sampleData.ts - Remove old leave sample, add new workflow-aligned leave samples, update notification
10. [x] ApprovalsPanel - Filter so Principal only sees Dean-submitted leave
11. [x] Type-check / verify build
