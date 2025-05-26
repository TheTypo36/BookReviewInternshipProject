# backend

## pagination

    - for me pagination was a new thing that i had to do So I studied about it and implement it with postgres and prisma
        -- i opt for offset pagination which was easier to implement in this we have page and limit and we call of postgres transaction and get the books and count of total books
        -- then we send books (based on limit) and total page, current page, nextpage and prev page
