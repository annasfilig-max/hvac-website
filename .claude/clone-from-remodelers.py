"""Clone the remodelers-website design verbatim into hvac-website,
swapping:
 - jsDelivr repo URL: remodelers-website -> hvac-website
 - Image extensions: .png -> .jpg
 - Navy accent (#4870A8) -> orange (#D9531E)
 - Kitchen/bath service content -> HVAC service content
 - Tagline + trust badges + hours + warranty terms
"""
import os, re, shutil

REM = os.path.expanduser('~/Downloads/Claude/remodelers-website')
HVAC = os.path.expanduser('~/Downloads/Claude/hvac-website')

PAGES = ['index.html','about.html','services.html','service-areas.html',
         'gallery.html','testimonials.html','faq.html','contact.html',
         'quote.html','privacy.html','terms.html','404.html']

# 1. Copy CSS, swap navy -> orange
with open(os.path.join(REM, 'assets/css/styles.css'), encoding='utf-8') as f:
    css = f.read()

css = css.replace('REMODELERS — Dark Premium + Brass Accent',
                  'HVAC — Dark Premium + Safety Orange')
css = css.replace('warm brass accent (kitchen/bath fixtures)',
                  'safety orange accent (HVAC trade)')
css = css.replace('--brass:        #4870A8', '--brass:        #D9531E')
css = css.replace('--brass-bright: #6090C8', '--brass-bright: #E8703D')
css = css.replace('--brass-deep:   #2D4F7E', '--brass-deep:   #B43F12')
css = css.replace('rgba(72, 112, 168, 0.5)',  'rgba(217, 83, 30, 0.5)')
css = css.replace('rgba(72, 112, 168, 0.1)',  'rgba(217, 83, 30, 0.1)')
css = css.replace('rgba(72, 112, 168, 0.45)', 'rgba(217, 83, 30, 0.45)')
css = css.replace('rgba(72, 112, 168, 0.3)',  'rgba(217, 83, 30, 0.3)')
css = css.replace('rgba(72, 112, 168, 0.04) 1px',
                  'rgba(217, 83, 30, 0.04) 1px')
css = css.replace('rgba(96, 144, 200, 0.32)', 'rgba(232, 112, 61, 0.32)')
# Hex literal navy that appears in gradient text mix
css = css.replace('#9DC0E8', '#FFB089')
# repo URL in CSS hero::before
css = css.replace('annasfilig-max/remodelers-website',
                  'annasfilig-max/hvac-website')
css = css.replace('hero.png', 'hero.jpg')
# Force #4870A8 in any !important overrides too
css = css.replace('#4870A8', '#D9531E')

with open(os.path.join(HVAC, 'assets/css/styles.css'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(css)
print('  CSS copied + navy -> orange')

# 2. Copy main.js verbatim (no theme-specific code in there)
shutil.copy(os.path.join(REM, 'assets/js/main.js'),
            os.path.join(HVAC, 'assets/js/main.js'))
print('  main.js copied')

# 3. Per-file content swaps for HTML
GLOBAL_HTML_SWAPS = [
    # repo URL
    ('annasfilig-max/remodelers-website', 'annasfilig-max/hvac-website'),
    # image extensions
    ('.png\'', '.jpg\''),
    ('.png"', '.jpg"'),
    # tagline
    ('Kitchen &amp; Bath Remodels', 'Heating &amp; Cooling &amp; Air'),
    ('Kitchen &middot; Bath &middot; Whole-Home Remodels',
     'Heating &middot; Cooling &middot; Air Quality'),
    # SEO
    ('Kitchen &amp; Bath Remodelers in [City, State]',
     'HVAC Services in [City, State]'),
    ('design-build kitchen and bath remodelers',
     'local HVAC company'),
    ('Custom cabinetry, countertops, tile, and full renovations.',
     '24/7 emergency service, upfront pricing, licensed &amp; insured.'),
    ('Remodels Done Right', 'HVAC Done Right'),
    ('Design-build kitchen and bath remodels by a local crew that finishes on time and on budget.',
     'Heating, cooling, and indoor air &mdash; fixed right the first time.'),
    ('Kitchen &amp; Bath Remodelers in', 'HVAC Services in'),
    # nav label
    ('<a href="gallery.html">Portfolio</a>',
     '<a href="gallery.html">Gallery</a>'),
    # Hero copy
    ('Kitchens &amp; Baths<br><em>Built To Last.</em>',
     'Heat, Cool &amp; <em>Comfort</em> &mdash; Done Right.'),
    ("Design-build remodels by a local crew that doesn't ghost mid-project. Measured, designed, built, and warrantied &mdash; start to reveal in one trade.",
     "When the AC quits at 2 a.m. or the furnace gives up on the coldest night, you don't need a sales pitch. You need someone who shows up, fixes it, and stands behind the work."),
    ('Book a Design Visit', 'Get a Free Quote'),
    ('View Portfolio', 'Call [Phone Number]'),
    ('Years Building', 'Years On The Job'),
    ('Rooms Done', 'Homes Serviced'),
    ('Houzz / Google', 'Avg Google'),
    ('Featured Build<br>[Project Name]', 'On Call<br>24/7 Emergency'),
    # Marquee
    ('NKBA Member Designers', 'NATE-Certified Technicians'),
    ('NARI Certified Builders', 'EPA 608 Universal Certified'),
    ('Free In-Home Design Visits', '24/7 Emergency Dispatch'),
    ('15-Year Workmanship Warranty', 'Lifetime Workmanship'),
    ('Lead-Safe EPA RRP Certified', 'BBB A+ Rated'),
    ('On-Time, On-Budget', 'Same-Day Service'),
    # Services section
    ('Six Specialties.<br>One Crew On Site.',
     'Six Services.<br>One Crew On Call.'),
    ('Design + Build, In-House', 'Diagnose + Fix + Warranty'),
    # Service card headlines + slugs
    ('href="services.html#kitchen"', 'href="services.html#ac-repair"'),
    ('href="services.html#bath"', 'href="services.html#heating-repair"'),
    ('href="services.html#cabinets"', 'href="services.html#ac-install"'),
    ('href="services.html#counters"', 'href="services.html#furnace-install"'),
    ('href="services.html#tile"', 'href="services.html#air-quality"'),
    ('href="services.html#design"', 'href="services.html#maintenance"'),
    ('id="kitchen"', 'id="ac-repair"'),
    ('id="bath"', 'id="heating-repair"'),
    ('id="cabinets"', 'id="ac-install"'),
    ('id="counters"', 'id="furnace-install"'),
    ('id="tile"', 'id="air-quality"'),
    ('id="design"', 'id="maintenance"'),
    # Service card numbers
    ('01 / Signature</span>\n          <h3>Kitchen Remodels</h3>',
     '01 / Cooling</span>\n          <h3>AC Repair</h3>'),
    ('02 / Signature</span>\n          <h3>Bath Remodels</h3>',
     '02 / Heating</span>\n          <h3>Furnace Repair</h3>'),
    ('03 / Cabinetry</span>\n          <h3>Cabinets &amp; Refacing</h3>',
     '03 / Install</span>\n          <h3>AC Installation</h3>'),
    ('04 / Surfaces</span>\n          <h3>Countertops &amp; Stone</h3>',
     '04 / Install</span>\n          <h3>Furnace &amp; Heat Pump</h3>'),
    ('05 / Tile</span>\n          <h3>Custom Tile &amp; Stone</h3>',
     '05 / Air Quality</span>\n          <h3>Indoor Air &amp; Ducts</h3>'),
    ('06 / Design</span>\n          <h3>Design Consultation</h3>',
     '06 / Plans</span>\n          <h3>Maintenance Plans</h3>'),
    # Service card descriptions (homepage)
    ('Full-gut to refresh. Cabinets, counters, lighting, flooring &mdash; one crew, one timeline, one warranty.',
     'Same-day diagnosis on every brand. Honest call on repair vs. replace &mdash; no upsell scripts.'),
    ('Spa-grade primary baths to clean second-bath refreshes. Tile, plumbing, vanities, glass &mdash; in-house.',
     "No heat at 2 a.m.? We're up. Gas, electric, oil &mdash; fixed right, parts in the truck."),
    ('Custom, semi-custom, or refacing. Tight joinery, real wood, finishes that hold &mdash; sized and installed in-house.',
     'Right-sized systems, clean install, and a manufacturer warranty we actually honor.'),
    ('Quartz, granite, marble, butcher block. Templated, fabricated, installed &mdash; without the markup games.',
     "High-efficiency systems sized to your home &mdash; not what's on the truck this week."),
    ('Backsplashes, shower walls, floors. Hand-laid by tile specialists &mdash; not the lowest-bid sub.',
     'Filtration, humidifiers, UV, and full duct cleaning. The stuff that actually moves the needle.'),
    ('3D visualization, material selection, and an honest budget &mdash; before any demo starts.',
     "Two visits a year, priority dispatch, no overtime fees. Cancel anytime &mdash; that's the deal."),
    ('Explore Kitchens &rarr;', 'AC Repair Details &rarr;'),
    ('Explore Baths &rarr;', 'Furnace Repair Details &rarr;'),
    ('See Cabinetry &rarr;', 'Install Details &rarr;'),
    ('See Surfaces &rarr;', 'Furnace &amp; Heat Pump &rarr;'),
    ('See Tile Work &rarr;', 'Air Quality Details &rarr;'),
    ('Book a Design Visit &rarr;', 'Maintenance Plans &rarr;'),
    # Portfolio (gallery preview)
    ('Recent<br>Transformations.', 'Recent Work.<br>Real Homes.'),
    ('[##]+ Builds Delivered', '4,800+ Homes Serviced'),
    ('Kitchen', 'AC Install'),
    ('Primary Bath', 'Furnace Install'),
    ('Cabinetry', 'Ductwork'),
    ('Custom Tile', 'Air Handler'),
    ('Open-Plan', 'Heat Pump'),
    ('Powder Room', 'Mini-Split'),
    ('Quartz Counters', 'Smart Thermostat'),
    ('See Full Portfolio &rarr;', 'See All Projects &rarr;'),
    # About story
    ('A Crew That<br>Treats Your Home<br>Like Their Own.',
     'A Crew That<br>Shows Up<br>When You Need Us.'),
    ('Family-owned since [Year]. Built on the idea that homeowners shouldn\'t have to be afraid of contractors &mdash; no mystery invoices, no high-pressure sales, no leaving you on hold for three weeks while we finish someone else\'s job.',
     "Family-owned since [Year]. Built on the idea that homeowners shouldn't have to be afraid of HVAC techs &mdash; no mystery invoices, no high-pressure sales, no leaving you sweating while we 'order the part' for two weeks."),
    ('Background-checked, drug-tested crew', 'Background-checked, drug-tested techs'),
    ('Fixed-price quotes &mdash; the invoice matches the quote', 'Flat-rate pricing &mdash; the invoice matches the quote'),
    ('Floors covered, daily cleanup, debris hauled', 'Shoe covers, drop cloths, mess hauled'),
    ('15-year workmanship warranty on every job', 'Lifetime workmanship warranty on every install'),
    # Process
    ('Sketch.<br>Build. Reveal.', 'Call.<br>Diagnose. Fix.'),
    ('Discovery Call', 'Call or Book'),
    ('15 minutes on the phone &mdash; scope, ballpark budget, and whether we\'re a fit.',
     'Reach a real person, not a phone tree. Lock in a window that fits your day.'),
    ('Design &amp; Quote', 'Diagnose'),
    ('In-home measure, 3D plans, material selections, fixed-price quote &mdash; before any demo.',
     'Inspect, explain what we find, quote a flat rate &mdash; before any work begins.'),
    ('Build It Right', 'Fix It Right'),
    ('Code-correct framing, plumbing, electrical, finishing &mdash; daily updates, no ghosts.',
     "Quality parts, code-correct work &mdash; we don't leave until you're comfortable again."),
    ('Reveal &amp; Warranty', 'Stand Behind It'),
    ('Walkthrough, punch list, 15-year workmanship warranty, clean job site at handoff.',
     'Workmanship guaranteed. If something\'s not right, one call brings us back &mdash; no charge.'),
    # Big quote
    ('Quoted in week one, demoed in week three, finished in week six &mdash; all within a hundred bucks of the original number. Every contractor we\'d hired before would have laughed at this kind of timeline. They actually delivered.',
     'Showed up the same morning we called, fixed our AC in 40 minutes, and the price on the invoice matched the quote exactly. Hard to find these days.'),
    ('Full Kitchen Remodel &middot; [City]', 'AC Repair &middot; [City]'),
    ('Janet &amp; David M.', 'Janet M.'),
    # Service areas
    ('Where We Build.', 'Where We Serve.'),
    # CTA
    ('Ready To<br><em>Sketch It?</em>', 'System Down?<br><em>We&#39;re On The Way.</em>'),
    ('Free in-home design visit. Fixed-price quote within five business days. No high-pressure sales script &mdash; just an honest scope and number.',
     '24/7 emergency dispatch across [Service Region]. Most calls answered in under 60 seconds. Most homes back up and running same day.'),
    # Form options
    ('Full kitchen remodel', 'AC not cooling'),
    ('Full bath remodel', 'Furnace not heating'),
    ('Cabinets / refacing', 'New AC install'),
    ('Countertops / surfaces', 'New furnace / heat pump'),
    ('Custom tile work', 'Indoor air quality'),
    ('Design consultation only', 'Maintenance plan'),
    ('Whole-home renovation', 'Emergency &mdash; system down now'),
    ('Square footage, age of home, what you\'re hoping to change&hellip;',
     "Brand, age of system, what it's doing &mdash; whatever you've got."),
    # Footer
    ('Specialties', 'Services'),
    ('Kitchen Remodels', 'AC Repair'),
    ('Bath Remodels', 'Furnace Repair'),
    ('Cabinets &amp; Refacing', 'AC Installation'),
    ('Countertops', 'Furnace &amp; Heat Pump'),
    ('Custom Tile', 'Indoor Air &amp; Ducts'),
    ('Design Consultation', 'Maintenance Plans'),
    ('Mon&ndash;Fri 8a&ndash;6p<br>Free In-Home Design Visits',
     'Mon&ndash;Fri 7a&ndash;7p &middot; Sat 8a&ndash;4p<br>24/7 Emergency Dispatch'),
    ('Design-build remodelers serving [Service Region]. Fixed-price quotes, real timelines, and a 15-year workmanship warranty on every job.',
     'Family-owned HVAC company serving [Service Region]. Honest work, fair pricing, and a guarantee behind every job.'),
    # Social row: Houzz -> Google
    ('aria-label="Houzz"',  'aria-label="Google"'),
    # Type schema
    ('"@type": "GeneralContractor"', '"@type": "LocalBusiness"'),
    # Title remnants
    ('Remodels Done Right', 'HVAC Done Right'),
    # Banner already says JT Marketing — keep
]

# Pin to a placeholder hash for now — will be re-pinned after commit
import shutil
for p in PAGES:
    src = os.path.join(REM, p)
    dst = os.path.join(HVAC, p)
    with open(src, encoding='utf-8') as fh: html = fh.read()
    for old, new in GLOBAL_HTML_SWAPS:
        html = html.replace(old, new)
    with open(dst, 'w', encoding='utf-8', newline='\n') as fh: fh.write(html)
    print(f'  built {p:25s}  {len(html):6d}b')

# Sitemap
with open(os.path.join(HVAC, 'sitemap.xml'), 'w', encoding='utf-8', newline='\n') as fh:
    fh.write('''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
''' + ''.join(
    f'  <url><loc>[https://yourdomain.com]/{p}</loc><lastmod>2026-05-03</lastmod><changefreq>monthly</changefreq><priority>{pri}</priority></url>\n'
    for p, pri in [('index.html','1.0'),('about.html','0.8'),('services.html','0.9'),
                   ('service-areas.html','0.8'),('gallery.html','0.7'),
                   ('testimonials.html','0.7'),('faq.html','0.7'),
                   ('contact.html','0.9'),('quote.html','0.9'),
                   ('privacy.html','0.3'),('terms.html','0.3')]
) + '</urlset>\n')

print('\nDone.')
