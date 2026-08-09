from html import escape

with open("ascii.txt", "r", encoding="utf-8") as f:
    lines = f.read().splitlines()

# Remove empty rows at top and bottom
while lines and not lines[0].strip():
    lines.pop(0)

while lines and not lines[-1].strip():
    lines.pop()

# Find the actual horizontal bounds of the ASCII artwork
non_empty = [line for line in lines if line.strip()]

left = min(len(line) - len(line.lstrip()) for line in non_empty)
right = max(len(line.rstrip()) for line in non_empty)

# Crop every line to the actual artwork area
lines = [
    line[left:right].rstrip()
    for line in lines
]

font_size = 15
line_height = 15

# Courier New is roughly 0.60 × font-size per character
char_width = font_size * 0.60

max_chars = max(len(line) for line in lines)

padding_x = 4
padding_y = 4

width = int(max_chars * char_width + padding_x * 2)
height = int(len(lines) * line_height + padding_y * 2)

tspans = []

for i, line in enumerate(lines):
    delay = i * 0.04

    tspans.append(
        f'<tspan '
        f'x="{padding_x}" '
        f'dy="{line_height}" '
        f'class="line" '
        f'style="animation-delay:{delay:.2f}s">'
        f'{escape(line)}</tspan>'
    )

svg = f'''<svg
xmlns="http://www.w3.org/2000/svg"
width="{width}"
height="{height}"
viewBox="0 0 {width} {height}"
preserveAspectRatio="xMidYMid meet">

<style>

text {{
    font-family: "Courier New", monospace;
    font-size: {font_size}px;
    fill: #c9d1d9;
    white-space: pre;
}}

.line {{
    opacity: 0;
    animation: reveal 0.12s forwards;
}}

@keyframes reveal {{
    from {{
        opacity: 0;
    }}

    to {{
        opacity: 1;
    }}
}}

</style>

<text
x="{padding_x}"
y="{padding_y}"
xml:space="preserve">

{"".join(tspans)}

</text>

</svg>
'''

with open("ascii.svg", "w", encoding="utf-8") as f:
    f.write(svg)

print(f"Created ascii.svg: {width} x {height}")