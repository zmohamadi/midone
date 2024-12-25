'use client'

export const getMenus = (user) => {
    const access = user?.role_id==1 ? true : false; 

    const admin = [
        { title: "dashboard", icon: "Home", href: "/dashboard" },
        { title: "promoters", icon: "Shield", href: "/promoters" },
        { title: "promotions", icon: "Book", href: "/promotions" },
        { title: "supports", icon: "List", href: "/supports" },
        {
            title: "reports", icon: "Calendar", open: false, 
            childs: [
                { title: "report_agree", icon: "Users", href: "/agrees" },
                { title: "report_promotion", icon: "PenTool", href: "/reports" },
                { title: "courses", icon: "List", href: "/courses" },
                { title: "tribunes", icon: "Tag", href: "/tribunes" },
                { title: "ritual", icon: "Aperture", href: "/rituals" },
                { title: "statistics", icon: "Calendar", href: "/statistics" },
            ]
        },
        {
            title: "blogs", icon: "Pocket", open: false, 
            childs: [
                { title: "blogs", icon: "List", href: "/blogs" },
                { title: "waiting_comments", icon: "BookOpen", href: "/blogComments" },
            ]
        },
        {
            title: "tickets", icon: "Tag", open: false, 
            childs: [
                { title: "tickets", icon: "List", href: "/tickets" },
                { title: "waiting_tickets", icon: "List", href: "/waitingTickets" },
                { title: "ticket_subjects", icon: "Tag", href: "/ticketSubjects" },
            ]
        },
        
        { title: "personnels", icon: "Users", href: "/personnels" },
    ];
    const promoter = [
        { title: "dashboard", icon: "Home", href: "/dashboard" },
        // { title: "active_promotions", icon: "Book", href: "/promotions" },
        { title: "myPromotions", icon: "Aperture", href: "/myPromotions" },
        { title: "myReports", icon: "List", href: "/myReports" },
        { title: "mySupports", icon: "PenTool", href: "/mySupports" },
        { title: "myTickets", icon: "Tag", href: "/myTickets" },
        // { title: "new_ticket", icon: "Pocket", href: "/myTickets/new" },
        { title: "blogs", icon: "Framer", href: "/blogs" },
    ];
    const commonMenus = [
        { title: "profile", icon: "User", href: "/profile" },
        { title: "change_password", icon: "Lock", href: "/change-password" },
    ];

    return access ? [...admin,...commonMenus] :  [...promoter,...commonMenus];
};
