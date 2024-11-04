WITH actual_data AS (
    SELECT 
        date_trunc('week', tx_timestamp) as week,
        sum(gmv) as total_gmv
    FROM 
        experimental_views.allo_gmv_leaderboard_events ap
    WHERE 
        (
            address = LOWER($1)
        ) 
        OR 
        (
            name = $2
        )
    GROUP BY 1
),
date_series AS (
    SELECT generate_series(
        (SELECT MIN(week) FROM actual_data),
        date_trunc('week', NOW()),
        interval '1 week'
    ) AS week
)
SELECT 
    ds.week,
    COALESCE(ad.total_gmv, 0) as gmv,
    SUM(COALESCE(ad.total_gmv, 0)) OVER (ORDER BY ds.week) as cumulative_gmv
FROM 
    date_series ds
LEFT JOIN 
    actual_data ad ON ds.week = ad.week
ORDER BY 
    ds.week ASC;