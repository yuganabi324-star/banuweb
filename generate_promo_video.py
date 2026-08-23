import os
import sys
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Check if imageio is installed, if not, try to install it
try:
    import imageio
except ImportError:
    print("imageio is not installed. Installing imageio and imageio-ffmpeg...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "imageio", "imageio-ffmpeg"])
    import imageio

# Video configuration
WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION = 30
TOTAL_FRAMES = FPS * DURATION  # 900 frames
OUTPUT_PATH = "public/promo.mp4"

# Set up paths
PUBLIC_DIR = "public"
LOGO_PATH = os.path.join(PUBLIC_DIR, "logomi.png")
OWNER_PATH = os.path.join(PUBLIC_DIR, "owner.jpg")
IPHONE17_PATH = os.path.join(PUBLIC_DIR, "iphone_17_pro_max.png")
S26_PATH = os.path.join(PUBLIC_DIR, "26ultra.png")
AIR_PATH = os.path.join(PUBLIC_DIR, "iphone_air.png")

# Load fonts
def get_font(name, size):
    # Try different standard fonts on Windows
    fonts = [
        "arial.ttf",
        "segoeui.ttf",
        "segoeuib.ttf" if "bold" in name.lower() else "segoeui.ttf",
        "tahoma.ttf",
        "verdana.ttf",
        "arialbd.ttf" if "bold" in name.lower() else "arial.ttf"
    ]
    
    font_dir = "C:\\Windows\\Fonts"
    for f in fonts:
        p = os.path.join(font_dir, f)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    
    # Fallback to default
    return ImageFont.load_default()

font_title = get_font("bold", 54)
font_subtitle = get_font("regular", 28)
font_motto_tamil = get_font("bold", 32)
font_body = get_font("regular", 22)
font_cta = get_font("bold", 45)

# Load images
def load_and_prep_image(path, max_w, max_h):
    if not os.path.exists(path):
        print(f"Warning: file {path} not found.")
        # Create a placeholder
        img = Image.new("RGBA", (100, 100), (128, 128, 128, 255))
        return img
    img = Image.open(path).convert("RGBA")
    # Resize keeping aspect ratio
    w, h = img.size
    ratio = min(max_w / w, max_h / h)
    new_size = (int(w * ratio), int(h * ratio))
    return img.resize(new_size, Image.Resampling.LANCZOS)

# Create a circle mask for images (like manager photo)
def get_circle_mask(size):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + size, fill=255)
    return mask

# Draw dynamic gradient background
def draw_gradient_background(frame_num):
    # Base gradient colors
    # We will interpolate standard dark colors to simulate a shifting background
    t = frame_num / TOTAL_FRAMES
    
    # Wave oscillation for the colors
    color_shift = math.sin(t * math.pi * 4) * 15
    
    # Dynamic dark gradient
    c1 = (int(2 + color_shift/2), int(6 + color_shift), int(23 + color_shift))  # Deep blue-black
    c2 = (int(15 + color_shift), int(23 + color_shift/2), int(42 + color_shift/2)) # Deep slate
    
    # Generate background
    bg = Image.new("RGBA", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(bg)
    
    # Draw linear gradient
    for y in range(HEIGHT):
        f = y / HEIGHT
        r = int(c1[0] * (1 - f) + c2[0] * f)
        g = int(c1[1] * (1 - f) + c2[1] * f)
        b = int(c1[2] * (1 - f) + c2[2] * f)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))
        
    # Draw glowing animated blobs in the background
    blob_draw = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    blob_drawer = ImageDraw.Draw(blob_draw)
    
    # Pulse cyan blob
    c_x = int(WIDTH * 0.75 + math.cos(t * math.pi * 6) * 120)
    c_y = int(HEIGHT * 0.3 + math.sin(t * math.pi * 4) * 80)
    r_cyan = int(220 + math.sin(t * math.pi * 8) * 30)
    # Draw radial glow
    for r_i in range(r_cyan, 0, -10):
        alpha = int((1 - r_i / r_cyan) * 18)
        blob_drawer.ellipse((c_x - r_i, c_y - r_i, c_x + r_i, c_y + r_i), fill=(0, 242, 254, alpha))
        
    # Pulse blue blob
    b_x = int(WIDTH * 0.2 + math.sin(t * math.pi * 5) * 100)
    b_y = int(HEIGHT * 0.7 + math.cos(t * math.pi * 6) * 90)
    r_blue = int(240 + math.sin(t * math.pi * 6) * 40)
    for r_i in range(r_blue, 0, -10):
        alpha = int((1 - r_i / r_blue) * 15)
        blob_drawer.ellipse((b_x - r_i, b_y - r_i, b_x + r_i, b_y + r_i), fill=(0, 82, 212, alpha))
        
    # Composite blobs onto gradient
    return Image.alpha_composite(bg, blob_draw)

# Helper to overlay image with alpha transparency
def overlay_image(base, overlay, position, alpha=255):
    if alpha == 0:
        return base
    if alpha < 255:
        # Create temporary overlay copy with scaled alpha
        r, g, b, a = overlay.split()
        a = a.point(lambda p: int(p * (alpha / 255.0)))
        overlay_mod = Image.merge("RGBA", (r, g, b, a))
    else:
        overlay_mod = overlay
        
    base.paste(overlay_mod, position, overlay_mod)
    return base

# Draw text with shadow for high contrast/readability
def draw_text_with_shadow(draw, text, position, font, fill_color=(255,255,255,255), shadow_color=(0,0,0,200), shadow_offset=(2,2)):
    x, y = position
    # Draw shadow
    draw.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color)
    # Draw main text
    draw.text((x, y), text, font=font, fill=fill_color)

# Draw central aligned text
def draw_centered_text(draw, text, y_pos, font, fill_color=(255,255,255,255), shadow_color=(0,0,0,200)):
    # Calculate text width to center it
    try:
        # get length of text in pixels
        w = draw.textlength(text, font=font)
    except AttributeError:
        # fallback for older PIL versions
        w, _ = draw.textsize(text, font=font)
    x = (WIDTH - w) // 2
    draw_text_with_shadow(draw, text, (x, y_pos), font, fill_color, shadow_color)

def main():
    print("Loading resources...")
    # Prepare assets
    logo = load_and_prep_image(LOGO_PATH, 280, 280)
    owner = load_and_prep_image(OWNER_PATH, 300, 300)
    
    # Make owner image round
    ow, oh = owner.size
    mask = get_circle_mask((ow, oh))
    round_owner = Image.new("RGBA", (ow, oh), (0,0,0,0))
    round_owner.paste(owner, (0, 0), mask)
    
    # Add a glowing border around owner image
    border_owner = Image.new("RGBA", (ow + 16, oh + 16), (0,0,0,0))
    border_draw = ImageDraw.Draw(border_owner)
    border_draw.ellipse((0, 0, ow + 16, oh + 16), fill=(0, 242, 254, 80))
    border_draw.ellipse((4, 4, ow + 12, oh + 12), fill=(0, 82, 212, 180))
    border_owner.paste(round_owner, (8, 8), round_owner)
    
    # Load phone images
    phone_iphone = load_and_prep_image(IPHONE17_PATH, 320, 480)
    phone_samsung = load_and_prep_image(S26_PATH, 320, 480)
    phone_air = load_and_prep_image(AIR_PATH, 320, 480)
    
    # Set up imageio video writer
    # This automatically uses ffmpeg under the hood to encode to libx264 with yuv420p format
    writer = imageio.get_writer(
        OUTPUT_PATH,
        fps=FPS,
        codec='libx264',
        pixelformat='yuv420p',
        quality=7
    )
            
    print(f"Generating video to {OUTPUT_PATH}...")
    
    for f_idx in range(TOTAL_FRAMES):
        # 1. Base background
        frame = draw_gradient_background(f_idx)
        draw = ImageDraw.Draw(frame)
        
        # Current time in seconds
        t = f_idx / FPS
        
        # SCENE 1: Welcome & Logo (0s - 6s, frames 0-180)
        if 0 <= t < 6.0:
            # Welcome banner
            # Determine opacity based on fade-in/fade-out
            alpha = 255
            if t < 1.0: # Fade in
                alpha = int(t * 255)
            elif t > 5.0: # Fade out
                alpha = int((6.0 - t) * 255)
                
            # Logo scaling (Ken Burns)
            scale = 1.0 + (t * 0.04) # Subtle zoom from 100% to 124%
            logo_scaled_w = int(logo.width * scale)
            logo_scaled_h = int(logo.height * scale)
            logo_scaled = logo.resize((logo_scaled_w, logo_scaled_h), Image.Resampling.LANCZOS)
            
            logo_x = (WIDTH - logo_scaled_w) // 2
            logo_y = (HEIGHT - logo_scaled_h) // 2 - 40
            
            overlay_image(frame, logo_scaled, (logo_x, logo_y), alpha)
            
            # Text Slogans
            # Glow effect on text
            glow_y = HEIGHT - 150
            draw_centered_text(draw, "MOBILE INN", glow_y, font_title, (0, 242, 254, alpha), (0, 82, 212, int(alpha * 0.6)))
            draw_centered_text(draw, "Sri Lanka's Premium Retailer & Certified Service Center", glow_y + 60, font_subtitle, (245, 245, 247, alpha), (0, 0, 0, int(alpha * 0.8)))
            
        # SCENE 2: Founder S. Banushan (6s - 12s, frames 180-360)
        elif 6.0 <= t < 12.0:
            t_scene = t - 6.0
            alpha = 255
            if t_scene < 1.0: # Fade in
                alpha = int(t_scene * 255)
            elif t_scene > 5.0: # Fade out
                alpha = int((6.0 - t_scene) * 255)
                
            # Layout: Manager image on left, text on right
            # Slide image in from left slightly
            img_x = int(120 + min(t_scene * 15, 30))
            img_y = (HEIGHT - border_owner.height) // 2
            
            overlay_image(frame, border_owner, (img_x, img_y), alpha)
            
            # Text on the right
            text_x = 520
            # Slide text in from right slightly
            text_x_anim = int(text_x - min((5.0 - t_scene) * 10, 0))
            
            draw_text_with_shadow(draw, "Meet the Founder & Director", (text_x_anim, 180), font_subtitle, (0, 242, 254, alpha))
            draw_text_with_shadow(draw, "S. BANUSHAN", (text_x_anim, 230), font_title, (255, 255, 255, alpha))
            
            # Tamil motto: "உங்கள் நம்பிக்கை… எங்கள் பொறுப்பு"
            draw_text_with_shadow(draw, "உங்கள் நம்பிக்கை… எங்கள் பொறுப்பு", (text_x_anim, 320), font_motto_tamil, (255, 190, 11, alpha))
            draw_text_with_shadow(draw, '"Your Trust is Our Responsibility"', (text_x_anim, 380), font_subtitle, (220, 220, 225, alpha))
            
            # Highlights
            draw_text_with_shadow(draw, "• 100% Genuine Apple & Samsung Devices", (text_x_anim, 460), font_body, (245, 245, 247, alpha))
            draw_text_with_shadow(draw, "• Unmatched Showroom Warranty", (text_x_anim, 500), font_body, (245, 245, 247, alpha))
            draw_text_with_shadow(draw, "• Trusted Service Since Inception", (text_x_anim, 540), font_body, (245, 245, 247, alpha))
            
        # SCENE 3: Flagship Showcase (12s - 20s, frames 360-600)
        elif 12.0 <= t < 20.0:
            t_scene = t - 12.0
            alpha = 255
            if t_scene < 1.0: # Fade in
                alpha = int(t_scene * 255)
            elif t_scene > 7.0: # Fade out
                alpha = int((8.0 - t_scene) * 255)
                
            # Three-stage phone showcase
            # 12s - 14.6s: iPhone 17 Pro Max
            # 14.6s - 17.3s: Samsung Galaxy S26 Ultra
            # 17.3s - 20s: iPhone Air
            
            # Show a top title
            draw_centered_text(draw, "UPGRADE TO THE FUTURE", 50, font_subtitle, (0, 242, 254, alpha))
            draw_centered_text(draw, "Discover Our Premium Lineup", 95, font_title, (255, 255, 255, alpha))
            
            # Draw pedestals base
            pedestal_w = 400
            pedestal_h = 40
            pedestal_x = (WIDTH - pedestal_w) // 2
            pedestal_y = HEIGHT - 130
            
            # Render active phone based on sub-timer
            sub_t = t_scene % 2.66
            sub_alpha = 255
            if sub_t < 0.5: # internal fade-in
                sub_alpha = int((sub_t / 0.5) * 255)
            elif sub_t > 2.16: # internal fade-out
                sub_alpha = int(((2.66 - sub_t) / 0.5) * 255)
                
            # Combine external scene alpha
            final_alpha = int(alpha * (sub_alpha / 255.0))
            
            # Choose image and metadata
            if t_scene < 2.66:
                active_img = phone_iphone
                phone_name = "iPhone 17 Pro Max"
                phone_desc = "Titanium Strength. Apple Intelligence Built-in."
                glow_color = (0, 242, 254)
            elif t_scene < 5.33:
                active_img = phone_samsung
                phone_name = "Samsung Galaxy S26 Ultra"
                phone_desc = "200MP Zoom. Peak AI performance."
                glow_color = (0, 82, 212)
            else:
                active_img = phone_air
                phone_name = "iPhone 17 Air"
                phone_desc = "The thinnest, sleekest iOS device ever."
                glow_color = (168, 85, 247)
                
            # Draw glow under the phone pedestal
            glow_draw = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,0))
            glow_drawer = ImageDraw.Draw(glow_draw)
            for r_i in range(160, 0, -10):
                g_alpha = int((1 - r_i / 160) * 45 * (final_alpha / 255.0))
                glow_drawer.ellipse((WIDTH//2 - r_i, pedestal_y - r_i//4, WIDTH//2 + r_i, pedestal_y + r_i//4), fill=glow_color + (g_alpha,))
            frame.paste(glow_draw, (0,0), glow_draw)
            
            # Draw base pedestal
            ped_draw = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,0))
            ped_drawer = ImageDraw.Draw(ped_draw)
            ped_drawer.ellipse((pedestal_x, pedestal_y - 15, pedestal_x + pedestal_w, pedestal_y + 15), fill=(20, 25, 45, int(final_alpha * 0.9)), outline=glow_color + (final_alpha,), width=2)
            frame.paste(ped_draw, (0,0), ped_draw)
            
            # Floating phone placement with bounce animation
            bounce = math.sin(t_scene * math.pi * 2.5) * 12
            phone_w, phone_h = active_img.size
            phone_x = (WIDTH - phone_w) // 2
            phone_y = pedestal_y - phone_h + 10 + int(bounce)
            
            overlay_image(frame, active_img, (phone_x, phone_y), final_alpha)
            
            # Draw phone labels on the sides
            draw_centered_text(draw, phone_name, HEIGHT - 85, font_title, (255, 255, 255, final_alpha))
            draw_centered_text(draw, phone_desc, HEIGHT - 35, font_body, (220, 220, 225, final_alpha))
            
        # SCENE 4: Certified Repairs (20s - 25s, frames 600-750)
        elif 20.0 <= t < 25.0:
            t_scene = t - 20.0
            alpha = 255
            if t_scene < 1.0: # Fade in
                alpha = int(t_scene * 255)
            elif t_scene > 4.0: # Fade out
                alpha = int((5.0 - t_scene) * 255)
                
            # Text Headings
            draw_centered_text(draw, "CERTIFIED WORKSHOP & SERVICES", 60, font_subtitle, (255, 190, 11, alpha))
            draw_centered_text(draw, "Professional Repairs & Care+", 110, font_title, (255, 255, 255, alpha))
            
            # Show two cards (left: repairs, right: customer benefits)
            card_w = 460
            card_h = 320
            card_y = 200
            
            # Left Card
            c1_x = 130
            c1_img = Image.new("RGBA", (card_w, card_h), (0,0,0,0))
            c1_draw = ImageDraw.Draw(c1_img)
            c1_draw.rounded_rectangle((0, 0, card_w, card_h), radius=20, fill=(15, 23, 42, int(alpha * 0.75)), outline=(0, 242, 254, int(alpha * 0.4)), width=2)
            
            draw_text_with_shadow(c1_draw, "🔧 Expert Device Repairs", (30, 30), font_subtitle, (0, 242, 254, 255))
            draw_text_with_shadow(c1_draw, "Fast, reliable solutions by specialists:", (30, 80), font_body, (220, 220, 225, 255))
            draw_text_with_shadow(c1_draw, "• Premium Display & Touch Replacement", (40, 130), font_body, (245, 245, 247, 255))
            draw_text_with_shadow(c1_draw, "• Original Battery Swap (100% Health)", (40, 170), font_body, (245, 245, 247, 255))
            draw_text_with_shadow(c1_draw, "• Chip-level Diagnostic & Port Repair", (40, 210), font_body, (245, 245, 247, 255))
            draw_text_with_shadow(c1_draw, "• Water Damage Recoveries", (40, 250), font_body, (245, 245, 247, 255))
            
            overlay_image(frame, c1_img, (c1_x, card_y), alpha)
            
            # Right Card
            c2_x = 690
            c2_img = Image.new("RGBA", (card_w, card_h), (0,0,0,0))
            c2_draw = ImageDraw.Draw(c2_img)
            c2_draw.rounded_rectangle((0, 0, card_w, card_h), radius=20, fill=(15, 23, 42, int(alpha * 0.75)), outline=(0, 82, 212, int(alpha * 0.4)), width=2)
            
            draw_text_with_shadow(c2_draw, "🛡️ Mobile Inn Guarantee", (30, 30), font_subtitle, (255, 190, 11, 255))
            draw_text_with_shadow(c2_draw, "Why purchase from us?", (30, 80), font_body, (220, 220, 225, 255))
            draw_text_with_shadow(c2_draw, "• Certified 6-Month Showroom Warranty", (40, 130), font_body, (245, 245, 247, 255))
            draw_text_with_shadow(c2_draw, "• Rigorous 35-Point Diagnostic Audit", (40, 170), font_body, (245, 245, 247, 255))
            draw_text_with_shadow(c2_draw, "• Fast Doorstep Pickup & Delivery", (40, 210), font_body, (245, 245, 247, 255))
            draw_text_with_shadow(c2_draw, "• Live WhatsApp Booking Support", (40, 250), font_body, (245, 245, 247, 255))
            
            overlay_image(frame, c2_img, (c2_x, card_y), alpha)
            
            # Bottom text
            draw_centered_text(draw, "Save time. Book your repair or reservation today.", 560, font_subtitle, (255, 255, 255, alpha))
            
        # SCENE 5: CTA & Closing Info (25s - 30s, frames 750-900)
        elif 25.0 <= t <= 30.0:
            t_scene = t - 25.0
            alpha = 255
            if t_scene < 1.0: # Fade in
                alpha = int(t_scene * 255)
            # No fade out at absolute end, keep it static
            
            # Show Logo on the left
            logo_scaled_w = 260
            logo_scaled_h = 260
            logo_resized = logo.resize((logo_scaled_w, logo_scaled_h), Image.Resampling.LANCZOS)
            logo_x = 180
            logo_y = (HEIGHT - logo_scaled_h) // 2 - 30
            
            overlay_image(frame, logo_resized, (logo_x, logo_y), alpha)
            
            # Pulse glow circle behind logo
            glow_draw = Image.new("RGBA", (WIDTH, HEIGHT), (0,0,0,0))
            glow_drawer = ImageDraw.Draw(glow_draw)
            glow_radius = int(220 + math.sin(t_scene * math.pi * 3) * 15)
            for r_i in range(glow_radius, 0, -10):
                g_alpha = int((1 - r_i / glow_radius) * 20 * (alpha / 255.0))
                glow_drawer.ellipse((logo_x + logo_scaled_w//2 - r_i, logo_y + logo_scaled_h//2 - r_i, logo_x + logo_scaled_w//2 + r_i, logo_y + logo_scaled_h//2 + r_i), fill=(0, 242, 254, g_alpha))
            frame.paste(glow_draw, (0,0), glow_draw)
            
            # Re-draw Logo on top of glow
            overlay_image(frame, logo_resized, (logo_x, logo_y), alpha)
            
            # Text details on the right
            text_x = 520
            
            draw_text_with_shadow(draw, "UPGRADE TODAY AT", (text_x, 150), font_subtitle, (0, 242, 254, alpha))
            draw_text_with_shadow(draw, "MOBILE INN", (text_x, 195), font_cta, (255, 255, 255, alpha))
            
            # Address and details
            draw_text_with_shadow(draw, "📍 No. 330A, Kasthuriyar Road, Jaffna", (text_x, 290), font_subtitle, (245, 245, 247, alpha))
            draw_text_with_shadow(draw, "📞 Hotline: +94 77 251 9160", (text_x, 345), font_subtitle, (245, 245, 247, alpha))
            draw_text_with_shadow(draw, "💬 Chat live on WhatsApp for exclusive deals!", (text_x, 400), font_body, (220, 220, 225, alpha))
            
            # Big beautiful button-style call to action
            btn_w = 400
            btn_h = 60
            btn_x = text_x
            btn_y = 470
            
            btn_img = Image.new("RGBA", (btn_w, btn_h), (0,0,0,0))
            btn_draw = ImageDraw.Draw(btn_img)
            btn_draw.rounded_rectangle((0, 0, btn_w, btn_h), radius=30, fill=(34, 197, 94, int(alpha * 0.95)), outline=(34, 197, 94, alpha))
            
            # Draw CTA Text in button
            try:
                # get length of text in pixels
                w = btn_draw.textlength("BOOK YOUR DEVICE NOW", font=font_body)
            except AttributeError:
                # fallback for older PIL versions
                w, _ = btn_draw.textsize("BOOK YOUR DEVICE NOW", font=font_body)
            tx = (btn_w - w) // 2
            ty = (btn_h - 22) // 2 - 2
            
            btn_draw.text((tx, ty), "BOOK YOUR DEVICE NOW", font=font_body, fill=(255, 255, 255, 255))
            overlay_image(frame, btn_img, (btn_x, btn_y), alpha)
            
            # Power text
            draw_text_with_shadow(draw, "POWERED BY DXA", (text_x, 560), font_body, (130, 140, 160, alpha))
            
        # Convert PIL frame to RGB numpy array for imageio
        rgb_frame = frame.convert("RGB")
        np_frame = np.array(rgb_frame)
        
        # Write frame to video
        writer.append_data(np_frame)
        
        if f_idx % 90 == 0:
            print(f"Generated {f_idx} / {TOTAL_FRAMES} frames ({int(t)}s / {DURATION}s)...")
            
    # Close writer
    writer.close()
    print("Video generation completed successfully! Saved to public/promo.mp4.")

if __name__ == "__main__":
    main()
