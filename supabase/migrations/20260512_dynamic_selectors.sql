-- MAZA Studio Dynamic Selector System
-- For Tistory/WordPress RPA stability

CREATE TABLE IF NOT EXISTS ms_selectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- 'tistory', 'wordpress'
    version TEXT NOT NULL,
    selectors JSONB NOT NULL, -- { "title": "...", "content": "...", "submit": "..." }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 기본 셀렉터 삽입 (티스토리 2026 기준)
INSERT INTO ms_selectors (platform, version, selectors) VALUES (
    'tistory',
    '2026.05.12',
    '{
        "title": "#post-title-0",
        "editor": ".editor-content",
        "submit_button": ".btn_publish",
        "visibility_private": "#visibility_private",
        "visibility_public": "#visibility_public"
    }'
) ON CONFLICT DO NOTHING;
