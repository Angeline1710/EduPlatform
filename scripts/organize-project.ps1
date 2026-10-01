$items = @{
  "components/AuthShell.tsx" = "components/auth/AuthShell.tsx"
  "components/BuyButton.tsx" = "components/commerce/BuyButton.tsx"
  "components/Certificate.tsx" = "components/certificates/Certificate.tsx"
  "components/CountUp.tsx" = "components/site/CountUp.tsx"
  "components/CourseCard.tsx" = "components/courses/CourseCard.tsx"
  "components/CourseForm.tsx" = "components/courses/CourseForm.tsx"
  "components/Crests.tsx" = "components/ui/Crests.tsx"
  "components/DeleteCourseButton.tsx" = "components/admin/DeleteCourseButton.tsx"
  "components/DepartmentFilter.tsx" = "components/courses/DepartmentFilter.tsx"
  "components/Footer.tsx" = "components/site/Footer.tsx"
  "components/Heartbeat.tsx" = "components/site/Heartbeat.tsx"
  "components/Hero.tsx" = "components/site/Hero.tsx"
  "components/HeroVideo.tsx" = "components/site/HeroVideo.tsx"
  "components/Icon.tsx" = "components/ui/Icon.tsx"
  "components/LessonManager.tsx" = "components/learning/LessonManager.tsx"
  "components/LessonViewer.tsx" = "components/learning/LessonViewer.tsx"
  "components/Nav.tsx" = "components/site/Nav.tsx"
  "components/Ornament.tsx" = "components/site/Ornament.tsx"
  "components/PageHeader.tsx" = "components/site/PageHeader.tsx"
  "components/PrintButton.tsx" = "components/certificates/PrintButton.tsx"
  "components/ProgressRing.tsx" = "components/site/ProgressRing.tsx"
  "components/Providers.tsx" = "components/site/Providers.tsx"
  "components/ProfileForm.tsx" = "components/profile/ProfileForm.tsx"
  "components/Reveal.tsx" = "components/site/Reveal.tsx"
  "components/Sidebar.tsx" = "components/site/Sidebar.tsx"
  "components/ThemeToggle.tsx" = "components/site/ThemeToggle.tsx"
  "components/UserControls.tsx" = "components/admin/UserControls.tsx"
  "components/VerifyForm.tsx" = "components/certificates/VerifyForm.tsx"

  "lib/activity.ts" = "lib/data/activity.ts"
  "lib/admin.ts" = "lib/admin/index.ts"
  "lib/analytics.ts" = "lib/data/analytics.ts"
  "lib/auth.config.ts" = "lib/auth/config.ts"
  "lib/auth.ts" = "lib/auth/index.ts"
  "lib/categories.ts" = "lib/data/categories.ts"
  "lib/certificates.ts" = "lib/data/certificates.ts"
  "lib/format.ts" = "lib/utils/format.ts"
  "lib/interest.ts" = "lib/insights/interest.ts"
  "lib/learning.ts" = "lib/learning/index.ts"
  "lib/prisma.ts" = "lib/data/prisma.ts"
  "lib/profile-fields.ts" = "lib/profile/fields.ts"
  "lib/profile.ts" = "lib/profile/index.ts"
  "lib/qr.ts" = "lib/utils/qr.ts"
  "lib/signals.ts" = "lib/insights/signals.ts"
  "lib/stripe.ts" = "lib/payments/stripe.ts"
}

foreach ($src in $items.Keys) {
  $dest = $items[$src]
  $srcPath = Join-Path $PSScriptRoot "..\$src"
  $destPath = Join-Path $PSScriptRoot "..\$dest"

  if (-not (Test-Path $srcPath)) {
    continue
  }

  $destDir = Split-Path $destPath
  if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
  }

  Move-Item -LiteralPath $srcPath -Destination $destPath -Force

  $relative = $dest.Replace('\\', '/')
  $shim = "export { default } from \"./$relative\";`nexport * from \"./$relative\";`n"
  Set-Content -Path $srcPath -Value $shim -Encoding UTF8
}

Write-Host "Project structure organized successfully."
