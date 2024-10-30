WITH 
  pagination_params AS (
    SELECT
      COALESCE(CAST($1 AS int), 1) AS page_number,
      COALESCE(CAST($2 AS int), 10) AS page_size
  ),
  time_range AS (
    SELECT
      CASE 
        WHEN $3 = 'this week' 
          THEN DATE_TRUNC('day', NOW() - (EXTRACT(DOW FROM NOW()) % 7) * INTERVAL '1 day')
        WHEN $3 = 'last week' 
          THEN DATE_TRUNC('day', NOW() - ((EXTRACT(DOW FROM NOW()) % 7 + 7) * INTERVAL '1 day'))
        ELSE TIMESTAMP '1970-01-01 00:00:00'
      END AS start_date,
      CASE 
        WHEN $3 = 'this week' 
          THEN DATE_TRUNC('day', NOW() - (EXTRACT(DOW FROM NOW()) % 7) * INTERVAL '1 day') + INTERVAL '6 days 23:59:59'
        WHEN $3 = 'last week' 
          THEN DATE_TRUNC('day', NOW() - ((EXTRACT(DOW FROM NOW()) % 7 + 7) * INTERVAL '1 day')) + INTERVAL '6 days 23:59:59'
        ELSE NOW()
      END AS end_date
  ),
  ranked_data AS (
    SELECT
      ROW_NUMBER() OVER (ORDER BY SUM(gmv) DESC) AS rank,
      address,
      name,
      SUM(gmv) AS total_gmv,
      MAX(tx_timestamp) AS last_timestamp,
      COUNT(*) OVER () AS total_records
    FROM 
      experimental_views.allo_gmv_leaderboard_events ap,
      time_range
    WHERE
      tx_timestamp BETWEEN time_range.start_date AND time_range.end_date
    GROUP BY
      address, name
  )
SELECT
  rank,
  address,
  name,
  total_gmv,
  last_timestamp,
  total_records,
  (SELECT page_number FROM pagination_params) AS current_page,
  (SELECT CEIL(CAST(total_records AS DECIMAL) / (SELECT page_size FROM pagination_params))) AS total_pages
FROM
  ranked_data
WHERE
  rank > (SELECT (page_number - 1) * page_size FROM pagination_params)
  AND rank <= (SELECT page_number * page_size FROM pagination_params)
ORDER BY
  rank;