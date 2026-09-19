const STYLE_ID = 'dsh-quick-buttons/dock.css'

const CSS = `
.dshqb-row{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:6px;
  width:100%;
  padding:2px 0 6px;
  min-height:28px;
  box-sizing:border-box;
}
.dshqb-chip{
  position:relative;
  display:inline-flex;
  align-items:stretch;
  max-width:100%;
}
.dshqb-main{
  height:26px;
  max-width:220px;
  padding:0 10px;
  border-radius:8px 0 0 8px;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  border-right:none;
  background:var(--dsw-alias-bg-module-platform, transparent);
  color:var(--dsw-alias-label-primary, inherit);
  font-size:12px;
  font-weight:500;
  line-height:1;
  cursor:pointer;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  transition:background .12s ease,border-color .12s ease;
}
.dshqb-main:hover{
  background:var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08));
}
.dshqb-main:disabled,.dshqb-send:disabled,.dshqb-add:disabled{
  opacity:.45;
  cursor:not-allowed;
}
.dshqb-send{
  height:26px;
  width:26px;
  padding:0;
  border-radius:0 8px 8px 0;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:var(--dsw-alias-bg-module-platform, transparent);
  color:var(--dsw-alias-label-secondary, #888);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:background .12s ease,color .12s ease;
}
.dshqb-send:hover{
  background:var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08));
  color:var(--dsw-alias-brand-primary, #4d6bfe);
}
.dshqb-del{
  position:absolute;
  top:-7px;
  right:-7px;
  z-index:2;
  width:14px;
  height:14px;
  padding:0;
  border-radius:50%;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:var(--dsw-alias-bg-layer-2, #fff);
  color:var(--dsw-alias-label-secondary, #666);
  font-size:10px;
  line-height:1;
  cursor:pointer;
  display:none;
  align-items:center;
  justify-content:center;
  box-shadow:0 1px 2px rgba(0,0,0,.12);
}
.dshqb-chip:hover .dshqb-del{display:inline-flex;}
.dshqb-del:hover{color:var(--dsw-alias-label-error, #e5484d);}
.dshqb-add,.dshqb-reset{
  height:26px;
  padding:0 8px;
  border-radius:8px;
  border:1px dashed var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:transparent;
  color:var(--dsw-alias-label-secondary, #888);
  font-size:12px;
  cursor:pointer;
}
.dshqb-add:hover,.dshqb-reset:hover{
  color:var(--dsw-alias-label-primary, inherit);
  border-style:solid;
}
.dshqb-form{
  display:inline-flex;
  flex-wrap:wrap;
  gap:4px;
  align-items:center;
}
.dshqb-input{
  height:26px;
  min-width:72px;
  max-width:180px;
  padding:0 8px;
  border-radius:8px;
  border:1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35));
  background:var(--dsw-alias-bg-module-platform, transparent);
  color:var(--dsw-alias-label-primary, inherit);
  font-size:12px;
  outline:none;
}
.dshqb-input:focus{
  border-color:var(--dsw-alias-brand-primary, #4d6bfe);
}
.dshqb-hint{
  width:100%;
  margin:0;
  font-size:11px;
  color:var(--dsw-alias-label-tertiary, #999);
}
.dshqb-main:focus-visible,.dshqb-send:focus-visible,.dshqb-add:focus-visible,
.dshqb-reset:focus-visible,.dshqb-del:focus-visible,.dshqb-input:focus-visible{
  outline:2px solid var(--dsw-alias-brand-primary, #4d6bfe);
  outline-offset:1px;
}
`

/** 每个页面只注入一次插件 CSS。 */
export function ensureStyles(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)) return
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-quick-buttons'
  tag.dataset.pluginCss = STYLE_ID
  tag.textContent = CSS
  document.head.appendChild(tag)
}
