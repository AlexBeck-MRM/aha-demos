on run argv
	if (count of argv) is less than 2 then error "Usage: export_ppt_preview.scpt <input-pptx> <output-dir>"
	set inputPath to item 1 of argv
	set outputDir to item 2 of argv
	set cwdPath to do shell script "pwd"
	if inputPath does not start with "/" then set inputPath to cwdPath & "/" & inputPath
	if outputDir does not start with "/" then set outputDir to cwdPath & "/" & outputDir
	set pdfPath to outputDir & "/preview.pdf"
	do shell script "mkdir -p " & quoted form of outputDir & " && rm -f " & quoted form of pdfPath & " && rm -f " & quoted form of (outputDir & "/slide-*.png")
	tell application "Microsoft PowerPoint"
		activate
		open POSIX file inputPath
		delay 1
		try
			save active presentation in POSIX file pdfPath as save as PDF
			close active presentation saving no
		on error errMsg number errNum
			try
				close active presentation saving no
			end try
			error (errNum as text) & ":" & errMsg
		end try
	end tell
	do shell script "/opt/homebrew/bin/pdftoppm -png -scale-to-x 1920 -scale-to-y 1080 " & quoted form of pdfPath & space & quoted form of (outputDir & "/slide")
end run
